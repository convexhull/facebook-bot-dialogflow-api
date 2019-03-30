var { dialogflowMiddleware } = require('../dialogflow/dialogflow');

module.exports = function(controller) {
    controller.middleware.receive.use(dialogflowMiddleware.receive);
    controller.hears('greet-intent', 'message_received', dialogflowMiddleware.hears, function(bot, message) {
        bot.startConversation(message, function(err, convo) {
            convo.say('Hello ! You just invoked hello-intent ;)');
        })
    })
}