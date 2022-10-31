const express = require("express");

//Handling errors
exports.handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {
    fullname: "",
    email: "",
    password: "", phoneNumber: "", address:""
  };

  if (err.code === 11000) {
    errors.email = "The Email or Username is already registered";
    return errors;
  }

  //validate errors
  if (err.message.includes("User validation failed"))
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });

  return errors;
};
