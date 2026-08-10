// src/utils/pdfInvoice.ts
import { User } from "@/types";

interface Payment {
    _id: string;
    plan: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
}

export function downloadInvoicePDF(payment: Payment, user: User | null) {
    const invoiceNumber = `FP-INV-${payment._id.slice(-8).toUpperCase()}`;
    const dateFormatted = new Date(payment.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
        alert("Please allow popups to download your PDF invoice.");
        return;
    }

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice ${invoiceNumber} - FitPass</title>
    <style>
        @page {
            size: A4;
            margin: 20mm;
        }
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            color: #1e293b;
            background: #ffffff;
            margin: 0;
            padding: 30px;
            -webkit-print-color-adjust: exact;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-b: 2px solid #6366f1;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .brand {
            font-size: 28px;
            font-weight: 900;
            color: #0f172a;
            letter-spacing: -0.5px;
        }
        .brand span {
            color: #8b5cf6;
        }
        .invoice-title {
            text-align: right;
        }
        .invoice-title h1 {
            font-size: 24px;
            margin: 0;
            color: #475569;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .invoice-title p {
            margin: 4px 0 0 0;
            font-size: 13px;
            color: #64748b;
        }
        .details-grid {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            background: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
        }
        .details-col h4 {
            margin: 0 0 8px 0;
            font-size: 12px;
            color: #94a3b8;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .details-col p {
            margin: 2px 0;
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
        }
        th {
            background: #0f172a;
            color: #ffffff;
            text-align: left;
            padding: 12px 16px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        td {
            padding: 16px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 14px;
        }
        .badge {
            display: inline-block;
            padding: 4px 10px;
            background: #dcfce7;
            color: #15803d;
            font-weight: 700;
            border-radius: 20px;
            font-size: 12px;
            text-transform: uppercase;
        }
        .summary {
            width: 300px;
            margin-left: auto;
            background: #f1f5f9;
            padding: 20px;
            border-radius: 12px;
        }
        .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 14px;
        }
        .summary-row.total {
            font-size: 18px;
            font-weight: 900;
            border-top: 2px solid #cbd5e1;
            padding-top: 10px;
            color: #0f172a;
        }
        .footer {
            margin-top: 60px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 20px;
        }
        @media print {
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div className="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="background: #8b5cf6; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">
            🖨️ Print / Save as PDF
        </button>
    </div>

    <div class="header">
        <div class="brand">Fit<span>Pass</span></div>
        <div class="invoice-title">
            <h1>INVOICE</h1>
            <p>${invoiceNumber}</p>
        </div>
    </div>

    <div class="details-grid">
        <div class="details-col">
            <h4>Billed To</h4>
            <p>${user?.name || "FitPass Customer"}</p>
            <p>${user?.email || "customer@example.com"}</p>
        </div>
        <div class="details-col">
            <h4>Payment Details</h4>
            <p>Date: ${dateFormatted}</p>
            <p>Status: <span class="badge">${payment.status}</span></p>
        </div>
        <div class="details-col">
            <h4>Payment Method</h4>
            <p>Stripe Credit Card</p>
            <p>Currency: ${payment.currency.toUpperCase()}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th style="text-align: right;">Total</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>FitPass ${payment.plan} Membership Pass</strong><br><span style="font-size: 12px; color: #64748b;">30-Day Unlimited Gym Access</span></td>
                <td>1</td>
                <td>$${payment.amount.toFixed(2)}</td>
                <td style="text-align: right;">$${payment.amount.toFixed(2)}</td>
            </tr>
        </tbody>
    </table>

    <div class="summary">
        <div class="summary-row">
            <span>Subtotal:</span>
            <span>$${payment.amount.toFixed(2)}</span>
        </div>
        <div class="summary-row">
            <span>Tax (0%):</span>
            <span>$0.00</span>
        </div>
        <div class="summary-row total">
            <span>Total Paid:</span>
            <span>$${payment.amount.toFixed(2)} USD</span>
        </div>
    </div>

    <div class="footer">
        <p>Thank you for choosing FitPass Inc. • Questions? Contact support@fitpass.com</p>
        <p>This is a computer-generated tax receipt.</p>
    </div>

    <script>
        window.onload = function() {
            setTimeout(function() {
                window.print();
            }, 300);
        };
    </script>
</body>
</html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
}
