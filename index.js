const fs = require("fs");
const { svg64 } = require("svg64");
const banksData = require("./banks.json");

const getBase64From = (filePath) => {
  try {
    // Read the SVG file synchronously
    const svgData = fs.readFileSync(filePath, "utf-8");

    // Convert the SVG data to base64
    const base64Data = svg64(svgData);

    return base64Data;
  } catch (err) {
    console.error("Error reading the SVG file:", err);

    return getUndefinedBankSvgBase64();
  }
};

const getUndefinedBankSvgBase64 = () => {
  const svgData = fs.readFileSync("logos/undefinedbank.svg", "utf-8");

  // Convert the SVG data to base64
  const base64Data = svg64(svgData);

  return base64Data;
};

const insertLogoStatement = (id, base64) =>
  `insert into svc_payment.bank_logo (id,content) values (${id},'${base64}');\n`;

const insertBanksStatement = (code, name_local, name_eng, logo_id) =>
  `insert into svc_payment.bank (code, name_local, name_eng,  logo_id)  values ('${code}','${name_local}','${name_eng}',${logo_id});\n`;

let insertSqlStatement = "";

/**
 *
 * IMPORTANT!!!!!!!!! SET CORRECT NUM OF BANKS
 *
 */
const numOfBanks = 45;

for (let i = 0; i <= numOfBanks; i++) {
  const base64 = getBase64From(`logos/${i}.svg`);
  insertSqlStatement += insertLogoStatement(i, base64);
}

//undefined bank svg data
const undefinedBankLogoBase64 = getUndefinedBankSvgBase64();
insertSqlStatement += insertLogoStatement(
  numOfBanks + 1,
  undefinedBankLogoBase64
);

for (const bank of banksData) {
  insertSqlStatement += insertBanksStatement(
    bank.first,
    bank.name,
    bank.nameEng,
    bank.bank_id
  );
}

//undefined bank svg data
insertSqlStatement += insertBanksStatement(
  "000000",
  "Карта Банку",
  "Bank Card",
  numOfBanks+1
);
// fs.writeFileSync("sql.txt", insertSqlStatement);
