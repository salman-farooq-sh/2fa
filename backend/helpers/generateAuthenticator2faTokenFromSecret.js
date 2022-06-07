const authenticator = require("otplib").authenticator;

const SECRET = process.argv[2];

async function main() {
  while (true) {
    const d = new Date();

    process.stdout.write(
      "\u001b[2K\u001b[0G" + // ANSI escape sequences to clear line and move cursor to line start
        `Secret: ${SECRET}` +
        ` | OTP: ${authenticator.generate(SECRET)}` +
        ` | OTP expires in: ${authenticator.timeRemaining()}s` +
        ` | Current Time: ${d.getHours()}h:${d.getMinutes()}m:${d.getSeconds()}s`
    );

    // sleep for 1000ms
    await new Promise((r) => setTimeout(r, 1_000));
  }
}

main();
