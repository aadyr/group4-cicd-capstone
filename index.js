module.exports.handler = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Enjoy FREE 6pc Chicken McNuggets with your first McDelivery purchase using this McDonald's coupon!",
          Coupon_Code: process.env.ACCESS_KEY
        },
        null,
        2
      ),
    };
  };