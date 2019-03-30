var { dialogflowMiddleware } = require('../dialogflow/dialogflow');
module.exports = function(controller) {
    var obj = {};
    var count = 0;
    controller.middleware.receive.use(dialogflowMiddleware.receive);

    controller.hears('gift-intent', 'message_received', dialogflowMiddleware.hears, function(bot, message) {
        bot.createConversation( message, function(err, convo) {
            convo.setVar('obj', obj);
            convo.addQuestion({
                text : 'Cool ! What would you like to buy ?',
                quick_replies : [
                    {
                        title : 'Camera',
                        payload : 'camera'
                    },
                    {
                        title : 'Glasses',
                        payload : 'glass'
                    },
                    {
                        title : 'Bullets',
                        payload : 'bullet'
                    }
                ]
            },
            [
                {
                    pattern : 'camera',
                    callback : function(res, convo) {
                        count++;
                        console.log("xxxxxx", res);
                        obj.item = res.text
                        console.log("final object", obj);
                        convo.say('count is')
                        console.log(`count is ${count}`)
                        convo.next();
                        convo.gotoThread('budget_thread');
                        convo.next();

                    }
                },
                {
                    pattern : 'glass',
                    callback : function(res, convo) {
                        count++;
                        obj.item = res.text;
                        console.log("final object", obj);
                        convo.say(`count is ${count}`)
                        console.log(`count is ${count}`)
                        convo.gotoThread('budget_thread');
                        convo.next();
                    }
                },
                {
                    pattern : 'bullet',
                    callback : function(res, convo) {
                        count++;
                        obj.item = res.text;
                        console.log("final object", obj);
                        convo.say(`count is ${count}`)
                        console.log(`count is ${count}`)
                        convo.gotoThread('budget_thread');
                        convo.next();
                    }
                },
                {
                    default : true,
                    callback : function(response, convo) {
                        convo.gotoThread('default');
                        convo.next();
                    }
                }
            ],
            );
            convo.addQuestion({
                text : 'What\'s your budget ?',
            },
            [
                {
                    pattern : '.*',
                    callback : function(res, convo) {
                        // console.log("xxxxxx", res);
                        obj.budget = res.text;
                        convo.setVar('obj',obj);
                        console.log("XXXXXXXXXXXXXXXXX");
                        var ans = "Showing {{vars.obj.item}}(s) under {{vars.obj.budget}}";
                        console.log(ans);
                        convo.say({
                            text : ans,
                            action : 'anything_else'
                        })
                        convo.next();
                    }
                },
                
            ],
            {},
            'budget_thread'
            );
            convo.addQuestion({
                text : 'Would you like to buy anything else ?',
            },
            [
                {
                    pattern : bot.utterances.yes,
                    callback : function(res, convo) {
                        convo.gotoThread('default');
                        convo.next();
                    }
                },
                {
                    pattern : bot.utterances.no,
                    callback : function(res, convo) {
                        console.log("zzzzzzzzzzzzzz");
                        convo.say({
                            text : 'Thanks for shopping with us !'
                        });
                        convo.next();
                    }
                },
                {
                    default : true,
                    callback : function(res, convo) {
                        console.log('wowwwww');
                        convo.say({
                            text : 'Sorry didn\'t get that',
                            action : 'anything_else'
                        });
                        convo.next();
                    }
                }
            ],
            {},
            'anything_else'
            )
            convo.activate();
        })
    })
}
