import Contract from "./contract.model.js";
import { createFilter, createPaginationInfo } from "../../lib/pagination.js";
import sendEmail from "../../lib/sendEmail.js";
import contractResponseTemplate from "../../lib/emailTemplates.js";

/**
 * @desc    Create a new contract service
 */
export const createContractService = async ({
  fullName,
  email,
  phoneNumber,
  occupation,
  message,
}) => {
  if (!fullName || !email || !message) {
    throw new Error("Full name, email, and message are required");
  }

  const contract = new Contract({
    fullName,
    email,
    phoneNumber: phoneNumber || "",
    occupation: occupation || "",
    message,
    status: "New",
  });

  const savedContract = await contract.save();
  return savedContract;
};

/**
 * @desc    Get all contracts with pagination and filters service
 */
export const getAllContractsService = async ({
  search,
  date,
  page = 1,
  limit = 10,
  sort = "-createdAt",
}) => {
 const query = {};

  // Check if search term is a date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const isDateSearch = dateRegex.test(search);

  // Search across multiple columns
  if (search && !isDateSearch) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { status: { $regex: search, $options: 'i' } },
      { message: { $regex: search, $options: 'i'}},
      { email: { $regex: search, $options: 'i'}},
    ];
  }

  // If search term is a date, search by date
  if (search && isDateSearch) {
    const startDate = new Date(search);
    const endDate = new Date(search);
    endDate.setDate(endDate.getDate() + 1);
    
    query.createdAt = {
      $gte: startDate,
      $lt: endDate
    };
  }

  // Separate date parameter (if you still want to support it)
  if (date && !isDateSearch) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);
    
    query.createdAt = {
      $gte: startDate,
      $lt: endDate
    };
  }
  const skip = (page - 1) * limit;

  const contracts = await Contract.find(query)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  

  const total = await Contract.countDocuments(query);
  const pagination = createPaginationInfo(parseInt(page), parseInt(limit), total);

  return { contracts, pagination };
};

/**
 * @desc    Get single contract by ID service
 */
export const getContractByIdService = async (id) => {
  const contract = await Contract.findById(id);
  if (!contract) {
    throw new Error("Contract not found");
  }
  return contract;
};

/**
 * @desc    Update a contract service
 */
// export const updateContractService = async (
//   id,
//   { fullName, email, phoneNumber, occupation, message, status }
// ) => {
//   const contract = await Contract.findById(id);
//   if (!contract) {
//     throw new Error("Contract not found");
//   }

//   if (fullName) contract.fullName = fullName;
//   if (email) contract.email = email;
//   if (phoneNumber) contract.phoneNumber = phoneNumber;
//   if (occupation) contract.occupation = occupation;
//   if (message) contract.message = message;
//   if (status) {
//     if (!["New", "Respond"].includes(status)) {
//       throw new Error("Status must be either 'New' or 'Respond'");
//     }
//     contract.status = status;
//   }

//   const updatedContract = await contract.save();
//   return updatedContract;
// };

/**
 * @desc    Respond to a contract service
 */
export const respondToContractService = async (id, responseMessage) => {
  if (!responseMessage) {
    throw new Error("Response message is required");
  }

  const contract = await Contract.findById(id);
  if (!contract) {
    throw new Error("Contract not found");
  }

  try {
    await sendEmail({
      to: contract.email,
      subject: "Response to Your Contract Request",
      html: contractResponseTemplate(contract.fullName, responseMessage),
    });

    contract.status = "Respond";
    await contract.save();

    return contract;
  } catch (emailError) {
    throw new Error(`Failed to send response email: ${emailError.message}`);
  }
};

/**
 * @desc    Delete a contract service
 */
export const deleteContractService = async (id) => {
  const contract = await Contract.findById(id);
  if (!contract) {
    throw new Error("Contract not found");
  }

  await Contract.findByIdAndDelete(id);
  return;
};