import { generateResponse } from "../../lib/responseFormate.js";
import mongoose from "mongoose";
import {
  createContractService,
  getAllContractsService,
  getContractByIdService,
  updateContractService,
  respondToContractService,
  deleteContractService,
} from "./contract.service.js";

/**
 * @desc    Create a new contract
 * @route   POST /api/v1/contracts
 * @access  Public
 */
export const createContract = async (req, res, next) => {
  const { fullName, email, phoneNumber, occupation, message } = req.body;

  try {
    const contract = await createContractService({
      fullName,
      email,
      phoneNumber,
      occupation,
      message,
    });

    generateResponse(res, 201, true, "Contract created successfully", contract);
  } catch (error) {
    if (error.message.includes("are required")) {
      generateResponse(res, 400, false, error.message, null);
    } else {
      next(error);
    }
  }
};

/**
 * @desc    Get all contracts with pagination and filters
 * @route   GET /api/v1/contracts
 * @access  Private (Admin)
 */
export const getAllContracts = async (req, res, next) => {
  try {
    const { search, date, page = 1, limit = 10, sort = "-createdAt" } = req.query;

    const { contracts, pagination } = await getAllContractsService({
      search,
      date,
      page,
      limit,
      sort,
    });

    generateResponse(res, 200, true, "Contracts retrieved successfully", {
      contracts,
      pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single contract by ID
 * @route   GET /api/v1/contracts/:id
 * @access  Private (Admin)
 */
export const getContractById = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return generateResponse(res, 400, false, "Invalid contract ID", null);
    }

    const contract = await getContractByIdService(id);

    generateResponse(res, 200, true, "Contract retrieved successfully", contract);
  } catch (error) {
    if (error.message === "Contract not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};

/**
 * @desc    Update a contract
 * @route   PUT /api/v1/contracts/:id
 * @access  Private (Admin)
 */
// export const updateContract = async (req, res, next) => {
//   const { id } = req.params;
//   const { fullName, email, phoneNumber, occupation, message, status } = req.body;

//   try {
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return generateResponse(res, 400, false, "Invalid contract ID", null);
//     }

//     const updatedContract = await updateContractService(id, {
//       fullName,
//       email,
//       phoneNumber,
//       occupation,
//       message,
//       status,
//     });

//     generateResponse(res, 200, true, "Contract updated successfully", updatedContract);
//   } catch (error) {
//     if (error.message === "Contract not found") {
//       return generateResponse(res, 404, false, error.message, null);
//     } else if (error.message.includes("Status must be")) {
//       return generateResponse(res, 400, false, error.message, null);
//     } else {
//       next(error);
//     }
//   }
// };

/**
 * @desc    Respond to a contract
 * @route   POST /api/v1/contracts/:id/respond
 * @access  Private (Admin)
 */
export const respondToContract = async (req, res, next) => {
  const { id } = req.params;
  const { responseMessage } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return generateResponse(res, 400, false, "Invalid contract ID", null);
    }

    const contract = await respondToContractService(id, responseMessage);

    generateResponse(res, 200, true, "Response sent successfully", contract);
  } catch (error) {
    if (error.message === "Contract not found") {
      return generateResponse(res, 404, false, error.message, null);
    } else if (error.message === "Response message is required") {
      return generateResponse(res, 400, false, error.message, null);
    } else if (error.message.includes("Failed to send")) {
      return generateResponse(res, 500, false, error.message, null);
    } else {
      next(error);
    }
  }
};

/**
 * @desc    Delete a contract
 * @route   DELETE /api/v1/contracts/:id
 * @access  Private (Admin)
 */
export const deleteContract = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return generateResponse(res, 400, false, "Invalid contract ID", null);
    }

    await deleteContractService(id);

    generateResponse(res, 200, true, "Contract deleted successfully", null);
  } catch (error) {
    if (error.message === "Contract not found") {
      return generateResponse(res, 404, false, error.message, null);
    }
    next(error);
  }
};