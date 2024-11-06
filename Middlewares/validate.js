const joi = require("joi");

exports.validateAdminRegistration = (data) => {
  const schema = joi.object().keys({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required().label("Email"),
    mobileNumber: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    password: joi
      .string()
      // .regex(RegExp(pattern))
      .required()
      .min(8)
      .max(20),
  });
  return schema.validate(data);
};

exports.validateAdminLogin = (data) => {
  const schema = joi.object().keys({
    email: joi.string().email().required().label("Email"),
    password: joi
      .string()
      // .regex(RegExp(pattern))
      .required()
      .min(8)
      .max(20),
  });
  return schema.validate(data);
};

exports.validateEmployeeLogin = (data) => {
  const schema = joi.object().keys({
    email: joi.string().email().required().label("Email"),
    device_token: joi.string().required(),
    password: joi
      .string()
      // .regex(RegExp(pattern))
      .required()
      .min(8)
      .max(20),
  });
  return schema.validate(data);
};

exports.changePassword = (data) => {
  const schema = joi.object().keys({
    email: joi.string().email().required().label("Email"),
    oldPassword: joi
      .string()
      // .regex(RegExp(pattern))
      .required()
      .min(8)
      .max(20),
    newPassword: joi
      .string()
      // .regex(RegExp(pattern))
      .required()
      .min(8)
      .max(20),
  });
  return schema.validate(data);
};

exports.userRegistration = (data) => {
  const schema = joi
    .object()
    .keys({
      name: joi.string().min(3).max(30).required(),
      email: joi.string().email().required().label("Email"),
      mobileNumber: joi
        .string()
        .length(10)
        .pattern(/^[0-9]+$/)
        .required(),
    })
    .options({ allowUnknown: true });
  return schema.validate(data);
};

exports.userLogin = (data) => {
  const schema = joi.object().keys({
    mobileNumber: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
  });
  return schema.validate(data);
};

exports.otpVerification = (data) => {
  const schema = joi.object().keys({
    mobileNumber: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    mobileOTP: joi.string().length(6).required(),
  });
  return schema.validate(data);
};

exports.createHeDetails = (data) => {
  const schema = joi.object().keys({
    he_mobileNumber: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    he_city: joi.string().required(),
    he_name: joi.string().required(),
    he_religion: joi.string().required(),
    he_fatherName: joi.string().required(),
    he_email: joi.string().email().required().label("Email"),
    he_dateOfBirth: joi.string().required(),
    he_residence_address: joi.string().required(),
    he_present_address: joi.string().required(),
    divorceId: joi.string().optional(),
  });
  return schema.validate(data);
};

exports.createSheDetails = (data) => {
  const schema = joi.object().keys({
    she_mobileNumber: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    she_husbandCity: joi.string().required(),
    she_name: joi.string().required(),
    she_religion: joi.string().required(),
    she_fatherName: joi.string().required(),
    she_email: joi.string().email().required().label("Email"),
    she_dateOfBirth: joi.string().required(),
    she_residence_address: joi.string().required(),
    she_present_address: joi.string().required(),
    divorceId: joi.string().optional(),
  });
  return schema.validate(data);
};

exports.createRequiredDetails = (data) => {
  const schema = joi.object().keys({
    cityOfMarriage: joi.string().required(),
    marriage_date: joi.string().required(),
    placeOfMarriage: joi.string().required(),
    doYouHave_children: joi.boolean().required(),
    is_maintenanceAlimony: joi.boolean().required(),
    is_settlementRegardingJointAssets: joi.boolean().required(),
    any_pending_ligitations: joi.boolean().required(),
    comment: joi.string().required(),
    post_marriage_address: joi.string().required(),
  });
  return schema.validate(data);
};

exports.contactUsForm = (data) => {
  const schema = joi.object().keys({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required().label("Email"),
    mobileNumber: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    message: joi.string().min(20).max(1000).required(),
    data_from_page: joi
      .string()
      .valid(
        "Mutual Divorce",
        "Mutual Divorce 1",
        "Cheque Bounce",
        "Corporate Law-IPR",
        "Corporate Law-ALL",
        "Corporate Law-CA",
        "Corporate Law-EL",
        "Corporate Law-BM",
        "Matrimonial",
        "Bail",
        "Property Dispute"
      )
      .optional(),
  });
  return schema.validate(data);
};

exports.leadOtpVerification = (data) => {
  const schema = joi.object().keys({
    leadId: joi.string().required(),
    mobileOTP: joi.string().length(6).required(),
  });
  return schema.validate(data);
};

exports.addMatuallyContactUsForm = (data) => {
  const schema = joi.object().keys({
    createdAt: joi.string().required(),
    mobileNumber: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
  });
  return schema.validate(data);
};

exports.reachOutValidation = (data) => {
  const schema = joi.object().keys({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required().label("Email"),
    message: joi.string().min(20).max(1000).required(),
  });
  return schema.validate(data);
};

exports.validateEmployeeRegistration = (data) => {
  const schema = joi.object().keys({
    name: joi.string().min(3).max(30).required(),
    email: joi.string().email().required().label("Email"),
    role: joi.string().valid("BDA", "Blogger", "BDAManager").required(),
    mobileNumber: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
    password: joi
      .string()
      // .regex(RegExp(pattern))
      .required()
      .min(8)
      .max(20),
  });
  return schema.validate(data);
};

exports.cSLeadLogValidation = (data) => {
  const schema = joi.object().keys({
    cSLeadId: joi.string().required(),
    nextCallTime: joi.string().optional(),
    isNextCall: joi.boolean().required(),
    callStatus: joi.string().required(),
    legalDomain: joi.string().required(),
    leadCategory: joi.string().required(),
    comment: joi.string().optional(),
  });
  return schema.validate(data);
};

exports.mDPFLeadLogValidation = (data) => {
  const schema = joi.object().keys({
    mDPFLeadId: joi.string().required(),
    nextCallTime: joi.string().optional(),
    isNextCall: joi.boolean().required(),
    callStatus: joi.string().required(),
    legalDomain: joi.string().required(),
    leadCategory: joi.string().required(),
    comment: joi.string().optional(),
  });
  return schema.validate(data);
};

exports.createMDPF = (data) => {
  const schema = joi.object().keys({
    you_are: joi.string().valid("Husband", "Wife").required(),
    name: joi.string().required(),
    marriage_date: joi.string().required(),
    spouse_name: joi.string().required(),
    paper_in_60Min: joi.boolean().required(),
    place_last_resided_together: joi.string().optional(),
    date_last_resided_together: joi.string().optional(), // YYYY-MM-DD
    total_payable_amount: joi.number().required(),
    anyChild: joi.boolean().optional(),
    your_contact_number: joi.string().required(),
    your_current_address: joi.string().optional(),
    your_email: joi.string().email().required(),
    reason_for_divorce: joi.string().optional(),
    term_accepted: joi.boolean().required(),
  });
  return schema.validate(data);
};

exports.create_PaymentLinkValidation = (data) => {
  const schema = joi.object().keys({
    amount: joi.string().required(),
    leadId: joi.string().required(),
  });
  return schema.validate(data);
};
