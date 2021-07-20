const Payment = require("../models/Payment");
const { list, read, create, update, deleteData } = require("./generalCrud");

const model = Payment;
const modelName = "pagament";
const fieldsToPopulate = "orderId";

const listPayments = async () => list(model, modelName, fieldsToPopulate);
const showPayment = async (paymentId) =>
  read(paymentId, model, modelName, fieldsToPopulate);
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
