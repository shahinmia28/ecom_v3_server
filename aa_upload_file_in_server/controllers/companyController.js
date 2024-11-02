import slugify from 'slugify';
import Company from '../models/companyModel.js';

export const createCompany = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(401).send({ message: 'Name is required' });
    }
    const existCategory = await Company.findOne({ name });

    if (existCategory) {
      res.status(200).send({ message: 'Company is already exist' });
    }

    const company = await Company.create({
      name: name,
      slug: slugify(name),
    });
    res.status(201).send({
      success: true,
      message: 'company is created successfully',
      company,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'company is not created',
    });
  }
};

//update category
export const updateCompany = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;
    const company = await Company.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: 'company Updated Successfully',
      company,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error while updating company',
    });
  }
};

// get all cat
export const allCompany = async (req, res) => {
  try {
    const companies = await Company.find({});
    res.status(200).send({
      success: true,
      message: 'All company List',
      companies,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error while getting all company',
    });
  }
};

// single category
export const singleCompany = async (req, res) => {
  try {
    const company = await Company.findOne({ slug: req.params.slug });
    if (!company) {
      return res.status(404).send({ message: 'company not found' });
    }
    res.status(200).send({
      success: true,
      message: 'Get Single company Successfully',
      company,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: 'Error While getting Single company',
    });
  }
};

//delete category
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    await Company.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: 'company Deleted Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'error while deleting company',
      error,
    });
  }
};
