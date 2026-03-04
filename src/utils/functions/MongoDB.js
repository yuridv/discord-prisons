const mongoose = require('mongoose');
const { colors } = require('../bases');
const Errors = require('./Errors');

const MongoDB = async() => new Promise(async(res, rej) => {
  try {
    console.log(`${colors.YELLOW}[MongoDB]=> Connecting...${colors.RESET}`);

    await mongoose.connect(process.env.MONGO_URL);

    process.on('SIGINT', Exit);
    process.on('SIGTERM', Exit);

    console.log(`${colors.GREEN}${colors.BOLD}[MongoDB]=> Connected successfully!${colors.RESET}`);
    
    return res();
  } catch(err) {
    return Errors(err, __filename)
      .then(() => MongoDB())
      .catch((e) => rej(e));
  }
});

module.exports = MongoDB;

const Exit = async() => {
  console.log(`${colors.RED}[MongoDB]=> Closing connection...${colors.RESET}`);
  
  await mongoose.disconnect();

  console.log(`${colors.RED}${colors.BOLD}[MongoDB]=> Connection closed!${colors.RESET}`);
  process.exit(0);
};