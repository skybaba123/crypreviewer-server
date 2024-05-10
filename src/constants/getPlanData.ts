const getPlanData = (plan: string) => {
  let price = 0;
  let botRuntimeHrs = 0;

  if (plan === "basic-lite") {
    price = 50;
    botRuntimeHrs = 2;
  } else if (plan === "basic-plus") {
    price = 100;
    botRuntimeHrs = 4;
  } else if (plan === "intermidiate-lite") {
    price = 500;
    botRuntimeHrs = 10;
  } else if (plan === "intermidiate-plus") {
    price = 1000;
    botRuntimeHrs = 15;
  } else if (plan === "advanced-lite") {
    price = 3000;
    botRuntimeHrs = 24;
  } else if (plan === "advanced-plus") {
    price = 5000;
    botRuntimeHrs = 24;
  } else if (plan === "advanced-pro") {
    price = 10000;
    botRuntimeHrs = 24;
  }

  return { price, botRuntimeHrs };
};

export default getPlanData;
