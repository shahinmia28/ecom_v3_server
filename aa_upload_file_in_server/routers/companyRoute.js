import express from 'express';
import { isAdmin, requiredSignIn } from '../middleware/authMiddleware.js';
import {
  allCompany,
  createCompany,
  deleteCompany,
  singleCompany,
  updateCompany,
} from '../controllers/companyController.js';
const companyRouter = express.Router();

// create company
companyRouter.post('/create', createCompany);

//getALl company
companyRouter.get('/get-all', allCompany);

//single company
companyRouter.get('/get-single/:slug', singleCompany);

//update company
companyRouter.put('/update/:id', updateCompany);

//delete company
companyRouter.delete('/delete/:id', deleteCompany);

export default companyRouter;
