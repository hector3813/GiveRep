from trader import Trader

trader = Trader()

def lambda_handler(event, context):
    """
    Main entry point for the Lambda function
    """
    try:
        # Process the trading state
        orders = trader.run(event)
        return {
            'statusCode': 200,
            'body': orders
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }