const { Command } = require("commander");
const { confirm } = require("@inquirer/prompts");
const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const path = require("path");
const dfd = require("danfojs-node");
const { cleanNumber } = require("./utils.js");
const fs = require("fs");

const program = new Command();

async function connectWhatsapp() {
  return new Promise((resolve) => {
    const client = new Client({
      authStrategy: new LocalAuth(),
      puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    });

    client.on("qr", (qr) => {
      qrcode.generate(qr, { small: true });
      console.log("Scan this qr to connect your whatsapp");
    });

    client.once("ready", async () => {
      console.log("Whatsapp connected");
      resolve(client);
    });

    client.initialize();
  });
}

program.command("login").action(async () => {
  const whatsapp = await connectWhatsapp();
  await whatsapp.destroy();
  console.log("Proceed to next command");
  process.exit();
});

program.command("logout").action(async () => {
  const whatsapp = await connectWhatsapp();
  await whatsapp.logout();
  console.log("Successfully disconnect whatsapp");
});

program
  .command("broadcast")
  .requiredOption("-f, --file <file>", "CSV file path to use in message")
  .requiredOption("-m, --message <message>", "Message content")
  .option(
    "--media <media>",
    "Media image/video/gif/etc, separate with | to send multiple files"
  )
  .option(
    "--phone_col <phone_col>",
    "The name of phone number column (default: phone_number)",
    "phone_number"
  )
  .requiredOption(
    "-d, --delay <delay>",
    "Delay between each send in ms (default: 5000ms)",
    "5000"
  )
  .action(async (options) => {
    if (!fs.existsSync("DATA/" + options.file)) {
      console.error(
        `Cannot find file ${options.file}, make sure you put it in the DATA folder inside this application`
      );
      return;
    }

    let whatsappMedia = [];

    if (options.media) {
      const pathList = options.media.split("|");
      for (const p of pathList) {
        const mediaPath = path.resolve("DATA/" + p);
        if (!fs.existsSync(mediaPath)) {
          console.error(
            `Cannot find file ${p}, make sure you put it in the DATA folder inside this application`
          );
          return;
        }
        whatsappMedia.push(MessageMedia.fromFilePath(mediaPath));
      }
    }

    const fileExt = options.file.match(/\.([^.]+)$/)[1].toLowerCase();
    const dataFile = path.resolve("DATA/" + options.file);

    let df = null;
    if (fileExt === "xlsx") {
      df = await dfd.readExcel(dataFile);
    } else {
      df = await dfd.readCSV(dataFile);
    }

    const columns = df.columns;

    const data = dfd.toJSON(df, { format: "column" });

    const parseMessage = (msg, dataRow) => {
      return msg.replace(/\{(.*?)\}/g, (_, key) => {
        return dataRow[key];
      });
    };

    const confirmation = await confirm({
      message: `You are going to send message to ${data.length} person\nAre you sure? `,
      default: true,
    });

    if (!confirmation) {
      console.log("Action cancelled");
      return;
    }

    const whatsapp = await connectWhatsapp();

    function delaySend(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    for (const [index, row] of data.entries()) {
      const target = `${cleanNumber(String(row[options.phone_col]))}@c.us`;
      const message = parseMessage(options.message, row);
      try {
        if (whatsappMedia.length > 0) {
          await whatsapp.sendMessage(target, whatsappMedia[0], {
            caption: message,
          });
          for (let i = 1; i < whatsappMedia.length; ++i) {
            await whatsapp.sendMessage(target, whatsappMedia[i]);
          }
        } else {
          await whatsapp.sendMessage(target, message);
        }
        console.log(
          `${index + 1}. Message sent to number ${row[options.phone_col]}`
        );
      } catch (err) {
        console.log(err);
        console.log(
          `!${index + 1}. Message to number ${
            row[options.phone_col]
          } failed to send`
        );
      }
      await delaySend(Number(options.delay));
    }

    console.log("All message has been sent");
    process.exit();
  });

program.parse();
