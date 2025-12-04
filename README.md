# WhatsApp Broadcast CLI

A simple command-line tool to automate sending WhatsApp messages (text and media) to multiple recipients using **whatsapp-web.js**.  
Supports CSV/XLSX files, custom column mapping, message templates with placeholders, optional media attachments, and per-message delay.

---

## 📌 Features

- Send message broadcasts via WhatsApp Web  
- Supports **CSV** and **XLSX** input files  
- Message templating using `{placeholder}` syntax  
- Send **multiple media files** per message (separated by `|`)  
- Customizable phone number column  
- Customizable delay between messages  
- Login/logout commands  
- CLI confirmation before sending

---

## 📦 Installation

1. Ensure you have **Node.js ≥ 16** installed.
2. Install dependencies:

```bash
npm install
```

3. Prepare the following folder structure:

```
.
├── DATA/
│   ├── your_file.csv
│   ├── your_media1.jpg
│   ├── your_media2.pdf
│   └── ...
└── index.js
```

All CSV/XLSX and media files **must** be placed inside the `DATA/` folder.

---

## 🔐 Login to WhatsApp

Before sending messages, you must login once.

```bash
node index.js login
```

This will:

- Display a QR code  
- Wait for you to scan it  
- Save the session automatically  
- Close the program when connected  

You will **remain logged in** as long as the session folder is not deleted.

---

## 🚪 Logout from WhatsApp

To remove your WhatsApp session:

```bash
node index.js logout
```

This logs out and removes the authentication.

---

## 📤 Broadcasting Messages

### Basic Usage

```bash
node index.js broadcast -f data.csv -m "Hello {name}" -d 5000
```

### Options

| Option | Description | Required |
|--------|-------------|----------|
| `-f, --file <file>` | CSV/XLSX filename inside `DATA/` folder | ✔️ |
| `-m, --message <message>` | Message text (supports `{placeholders}`) | ✔️ |
| `--media <media>` | Send media files (separate with `|`) | ❌ |
| `--phone_col <phone_col>` | Column name for phone numbers (default: `phone_number`) | ❌ |
| `-d, --delay <delay>` | Delay between messages in ms (default: `5000`) | ✔️ |

---

## 📝 Example CSV Format

Your CSV/XLSX file must include at least the phone column (default `phone_number`).  
You may include any other columns for placeholders.

```
phone_number,name,order_id
6281234567890,John,AB-115
6289876543210,Sarah,ZX-228
```

---

## 🧩 Using Message Templates

You can insert any column value using `{column_name}`.

Example:

```bash
-m "Hello {name}, your order {order_id} is ready."
```

---

## 🖼 Sending Media

You can send **one or multiple files**:

```bash
--media "image1.jpg|image2.png|file.pdf"
```

All files must be inside the `DATA/` folder.

If you send multiple media files:

- The **first** file will include the caption  
- The rest are sent without caption

---

## 📚 Full Example Command

```bash
node index.js broadcast \
-f customers.xlsx \
-m "Hello {name}, thank you for your purchase {order_id}" \
--media "promo.jpg|invoice.pdf" \
--phone_col phone \
-d 3000
```

---

## ⚠️ Important Notes

- WhatsApp may temporarily restrict accounts that send too many automated messages too quickly.  
  Increase delay to reduce the risk.
- Keep the `DATA/` folder organized and safe.
- Do **not** close the terminal while sending messages.

---

## 📝 License

This tool is for educational and personal use.  
You are responsible for complying with WhatsApp’s terms of service.

---

## 👤 Author

CLI Broadcast Tool — powered by `whatsapp-web.js`, `commander`, and `danfojs-node`.

