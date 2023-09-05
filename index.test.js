const { handler } = require('./index');

describe('Lambda Handler', () => {
  it('returns a successful response', async () => {
    const event = { key: 'value' };
    const expectedResponse = {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Enjoy FREE 6pc Chicken McNuggets with your first McDelivery purchase using this McDonald's coupon!",
        },
        null,
        2
      ),
    };
    const response = await handler(event);
    expect(response).toEqual(expectedResponse);
  });
});