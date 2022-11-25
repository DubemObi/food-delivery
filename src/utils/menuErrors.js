const express = require("express");

//Handling errors
exports.handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {
    foodName: "",
    category: "",
    price: "",
    image: "",
    category: "",
  };

  //validate errors
  if (err.message.includes("Menu validation failed"))
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });

  return errors;
};
