import express, { Request, Response, NextFunction } from 'express';
import patientService from '../services/patientService';
import diagnoseService from '../services/diagnoseService';
import { NewPatientSchema } from '../utils';
import { z } from 'zod';
import { Patient, NewPatient, EntryWithoutId} from '../types';
import entryService from '../services/entryService';

const router = express.Router();


const newPatientParser = (req: Request, _res: Response, next: NextFunction) => { 
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => { 
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.get('/ping', (_req, res) => {
    res.json('{"content": "Pong!"}');
  });

  router.get('/patients', (_req, res) => {
    res.json(patientService.getEntriesNonSSN());
  });

  router.get('/patients/:id', (req, res) => {
    const patient = patientService.findById(req.params.id);
  
    if (patient) {
      res.send(patient);
    } else {
      res.sendStatus(404);
    }
  });

  router.post('/patients', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedEntry = patientService.addPatient(req.body);
    res.json(addedEntry);
  });

  router.get('/diagnoses', (_req, res) => {
    res.json(diagnoseService.getEntries());
  });

  router.post('/patients/:id/entries', (req, res) => {

    const id = req?.params?.id;
    const body = req?.body as EntryWithoutId;

    const addedDiagnose = entryService.addEntry(body, id);
    res.json(addedDiagnose);
  });

  router.use(errorMiddleware);

export default router;