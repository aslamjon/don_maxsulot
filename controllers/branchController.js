const { Types } = require('mongoose');
const {BranchModel} = require("../models/branchModel");

const logger = require("../utils/logger");
const {errors} = require("../utils/constants");
const {getDataFromModelByQuery, getOneFromModelByQuery, getTimes} = require("../utils/utiles");

const fileName = require('path').basename(__filename);

const errorHandling = (e, functionName, res) => {
    logger.error(`${e.message} -> ${fileName} -> ${functionName}`);
    errors.SERVER_ERROR(res);
}

const getBranchesByQuery = ({query = {}} = {}) => getDataFromModelByQuery({ Model: BranchModel, query })
const getOneBranchByQuery = ({query = {}} = {}) => getOneFromModelByQuery({ Model: BranchModel, query })

// REQUEST AND RESPONSE

const createBranch = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).send({ message: "name field is required" });

        const branch = await BranchModel.findOne({ name });
        if (branch) res.status(400).send({ message: "branch is already exists" });
        else {
            const newBranch = new BranchModel({ name, createdById: req.user.userId, createdAt: getTimes() });
            await newBranch.save();
            // const branches = await getBranchesByQuery();
            res.send({ message: "branch has been successfully created", data: { ...newBranch._doc } });
        }
    } catch (e) {
        errorHandling(e, createBranch.name, res);
    }
}

const getAllBranches = async (req, res) => {
    try {
        const branch = await getBranchesByQuery();
        res.send({ data: branch });
    } catch (e) {
        errorHandling(e, getAllBranches.name, res);
    }
}

const getBranch = async (req, res) => {
    try {
        const { id } = req.params;
        if (id === "null") return res.status(400).send({ message: "id should not be null" });
        const branch = await getOneBranchByQuery({ query: {_id: id}});
        res.send({ data: branch });
    } catch (e) {
        errorHandling(e, getBranch.name, res);
    }
}

const updateBranch = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!name || !id) return res.status(400).send({ message: "name and id fields are required" });
        const branch = await getOneBranchByQuery({ query: {_id: id}});
        if (!branch) res.status(404).send({ message: "branch is not found" });
        else {
            branch.name = name;
            branch.updated = true;
            branch.updatedAt = getTimes();
            branch.updatedById = Types.ObjectId(req.user.userId);
            await branch.save();
            const branches = await getBranchesByQuery();
            res.send({ message: "branch has been updated", data: { branches } });
        }
    } catch (e) {
        errorHandling(e, updateBranch.name, res);
    }
}

const deleteBranch = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send({ message: "id field is required" });
        if (id === "null") return res.status(400).send({ message: "id should not be null" });
        const branch = await getOneBranchByQuery({ query: {_id: id}});
        if (!branch) res.status(404).send({ message: "branch not found" });
        else {
            branch.deleted = true;
            branch.deletedAt = getTimes();
            branch.deletedById = Types.ObjectId(req.user.userId);
            await branch.save();
            const branches = await getBranchesByQuery();
            res.send({ message: "branch has been deleted", data: {branches}});
        }

    } catch (e) {
        errorHandling(e, deleteBranch.name, res);

    }
}

module.exports = {
    createBranch,
    getAllBranches,
    updateBranch,
    deleteBranch,
    getBranch
}