const Payment = require("../models/Payment");
const { list, read, create, update, deleteData } = require("./generalCrud");

const model = Payment;
const modelName = "pagament";

const listPayments = async () => list(model, modelName);
const showPayment = async (paymentId) => read(paymentId, model, modelName);
const createPayment = async (newPayment) =>
  create(newPayment, model, modelName);
const modifyPayment = async (paymentId, modifiedPayment) =>
  update(paymentId, modifiedPayment, model, modelName);
const deletePayment = async (paymentId) =>
  deleteData(paymentId, model, modelName);

module.exports = {
  listPayments,
  showPayment,
  createPayment,
  modifyPayment,
  deletePayment,
};
