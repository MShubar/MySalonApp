const express = require('express');
const router = express.Router();
const controller = require('../controllers/training');

router.get('/', controller.getTrainings);
router.post('/', controller.createTraining);
router.get('/:id', controller.getTrainingById);
router.put('/:id', controller.updateTraining);
router.delete('/:id', controller.deleteTraining);

router.post('/:id/enroll-user', controller.enrollUserInTraining);
router.post('/:id/cancel-user', controller.cancelUserEnrollmentRequest);
router.get('/user/:userId', controller.getUserEnrollments);

router.post('/:id/enroll-salon', controller.enrollSalonInTraining);
router.post('/:id/cancel-salon', controller.cancelSalonEnrollmentRequest);
router.get('/salon/:salonId', controller.getSalonEnrollments);

router.post('/:id/certificate', controller.issueCertificate);

module.exports = router;
