# WhatsApp CLI Tool

A command-line application for sending WhatsApp messages using `whatsapp-web.js`.  
Supports: persistent login, broadcast messaging, message templates, file-based messaging, delays, and logout.

---

## 📦 Installation

```sh
git clone <repository-url>
cd <project-folder>
npm install
```

---

## 📂 Folder Setup

Make sure your folder looks like this:

```
.
├── DATA/                # Put CSV/XLSX and media files here
├── index.js
└── README.md
└── ... 
```

---

## 🧠 Features

- Persistent WhatsApp connection using LocalAuth
- Broadcast messaging from CSV/XLSX
- Dynamic message templating using `{field}`
- Optional media sending
- Safe delay between messages (to avoid spam blocking)
- Logout command to remove stored authentication

---

## 🚀 Commands

### 🔹 1. Login

```sh
node index.js login
```

- A QR code will be shown.
- Scan with WhatsApp (Linked Devices menu).
- After connected, the session will be saved automatically.

---

### 🔹 2. Broadcast Messages

```sh
node index.js broadcast \
  --file <filename> \
  --message "<content>" \
  --media <optional file> \
  --delay <milliseconds>
```

#### Example:

```sh
node index.js broadcast \
  --file participants.xlsx \
  --message "Hello {name}, your number is {number}" \
  --media poster.jpg \
  --delay 2000
```

#### Supported formats:

| Format | Status |
|--------|--------|
| `.csv` | ✔ Supported |
| `.xlsx` | ✔ Supported |

#### Required columns:

| Column | Description |
|--------|------------|
| `name` | Receiver name |
| `number` | WhatsApp number in international format (e.g., 6281234567890) |

---

### 🧩 Message Templating

Use fields from your file using `{columnName}`.

**Example row:**

| name | number |
|------|--------|
| Rama | 6281230001 |

**Message:**

```
Hello {name}, your registered number is {number}.
```

**Output:**

```
Hello Rama, your registered number is 6281230001.
```

---

### 🔹 3. Logout

```sh
node index.js logout
```

- This deletes your saved WhatsApp session.
- Next time you run login, you'll need to scan the QR again.
