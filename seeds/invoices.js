const config = require("../config.json");
const { getRandomDate, getRandomNumberInRange, getData } = require("../utils");
const { runQuery } = require("../modules/mysql/sql");
const { insert } = require("../modules/mysql/query");
const companyNames = [
  "creekview",
  "amazon",
  "twitter",
  "facebook",
  "photomechanical",
  "evapo",
  "the jump",
  "vape lounge",
  "toys r us",
  "sports direct",
  "jd sport",
];

const createInvoices = async () => {
  console.log("generating users");

  try {
    const users = await getData("users");

    const invoices = [];
    let count = 1;
    for (const user of users) {
      const billingDate = getRandomDate();
      const invoice = {
        company: {
          contact: `${user.first_name} ${user.last_name}`,
          name: companyNames[Math.floor(Math.random() * companyNames.length)],
          address: user.address.street_address,
          city: user.address.city,
          state: user.address.state,
          country: user.address.country,
          postcode: user.address.zip_code,
        },

        items: [],
        specifics: {
          billingDate,
          dueDate: getRandomDate(billingDate),
          orderNumber: getRandomNumberInRange(1, 999999),
          footer: "this would be sent by user",
        },
      };

      invoices.push(invoice);
      const items = await getData("appliances", getRandomNumberInRange(2, config.invoiceItemCount)); //Unfortunately they only allow a limit off 100, so have to call for each user

      for (const item of items) {
        const invoiceItem = {
          sku: item.equipment,
          description: "this would be a user description",
          quantity: getRandomNumberInRange(1, 10000),
          price: getRandomNumberInRange(1, 100),
          tax: getRandomNumberInRange(0, 12),
        };

        invoice.items.push(invoiceItem);
      }

      console.log(`Created user ${count}`);
      count++;
    }

    return invoices;
  } catch (err) {
    console.log("error creting invoice seed", err);
    return;
  }
};

const seedDatabase = async (payload) => {
  console.log("Seeding database ");

  for (invoice of payload) {
    const { company, specifics, items } = invoice;
    const { insertId: companyInsertId } = await runQuery(
      insert("invoice_company", [
        "contact",
        "name",
        "address",
        "city",
        "state",
        "country",
        "postcode",
      ]),
      Object.values(company)
    );

    const { insertId: specificsInsertId } = await runQuery(
      insert("invoice_specifics", ["due_date", "billing_date", "order_number", "footer"]),
      Object.values(specifics)
    );

    const itemIds = [];
    for (const item of items) {
      const { insertId: itemId } = await runQuery(
        insert("invoice_items", ["sku", "description", "quantity", "price", "tax"]),
        [item.sku, item.description, item.quantity, item.price, item.tax]
      );

      itemIds.push(itemId);
    }

    //Begin relationship entries

    const { insertId: userRelationship } = await runQuery(
      insert("user_invoices", ["user_id", "invoice_id"]),
      [config.userId, companyInsertId]
    );

    const { insertId: specificsRelationship } = await runQuery(
      insert("invoice_specific", ["invoice_id", "specific_id"]),
      [companyInsertId, specificsInsertId]
    );

    for (const itemId of itemIds) {
      const { insertId: itemInsertId } = await runQuery(
        insert("invoice_item", ["invoice_id", "item_id"]),
        [companyInsertId, itemId]
      );
    }
  }

  console.log("done");
};

const main = async () => {
  console.log("starting");
  const invoices = await createInvoices();
  invoices && (await seedDatabase(invoices));
};

module.exports = main;
