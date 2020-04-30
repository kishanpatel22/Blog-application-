var mongoose            = require("mongoose");
var blog                = require("./blogs.js");
var user                = require("./user.js");
var user_services_class = require("./user_services.js")

const user_service = new user_services_class();

/* The function will clear the earlier data base
 * and adds tempory data for testing and error debugging
 * Initializing the database 
 */
function init_db() {

blogs = [
    {
        title   : 'The coronavirus test that might exempt you from social distancing—if you pass', 
        image   : 'https://www.deccanherald.com/sites/dh/files/styles/article_detail/public/article_images/2020/04/02/iStock-1214127666-1585820287.jpg?itok=oHwuAoKL',
        content : 'On Monday, President Trump announced that the US had tested over a million patient samples for coronavirus, by far more than any other country in the world. Though the horrendously slow rollout of testing has already set America back in its effort to stop the spread of covid-19, testing is still vital. To beat the virus and stop its spread, says the World Health Organization, we need to identify those who are infected and isolate them, as well as those at risk (who ought to be self-isolating too, whether they are symptomatic or asymptomatic). We also need to figure out which communities can expect to see a rise in coronavirus cases, and where to allocate resources in anticipation of rising hospitalizations.'
    },
    {
        title   : 'Air India pilot unions oppose 10% cut in employees allowances',
        image   : 'https://static-news.moneycontrol.com/static-mcnews/2018/06/Air-India-building-Mumbai-770x433.jpg',
        content : "State-owned Air India's pilot unions on Friday opposed the 10 percent cut in employees' allowances, terming the decision as unequal and that goes against the spirit of Prime Minister Narendra Modi's appeal to the companies to ensure that the salaries of the employees are not slashed amid the coronavirus pandemic. In a joint letter to Air India chief Rajiv Bansal on Friday, the Indian Pilots Guild (IPG) and Indian Commercial Pilots Association (ICPA) said the reduction in allowance was against the labour and employment ministry's advisory to all employers of public or private establishments not to terminate their employees or reduce their wages."
    },
    {
        title   : 'Apple leaks its own iPhone, and more tech news you need to know today',
        image   : 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTxaWZCMCIpsNba16OnP-lxjblfQf8Zie-tibBFeSal_xRRYUk4&usqp=CAU',
        content : 'A last-minute leak has seemingly confirmed the iPhone XS, XS Max, and XR names for Apple’s newest phones, and revealed new Apple Watch sizes. The names, first spotted by ATH, are found in a product sitemap XML file hosted on Apple.com, and are associated with items that will be available to purchase including AppleCare support, phone cases, and Watch bands. Today’s leak would put the names “iPhone XS Plus” and “iPhone XC” out of contention. iOS 13 already added a way to track a lost iPhone via a Bluetooth beacon signal that it can transmit. These AirTags could work in the same way. Once attached to any item, much like Tiles, they’d transmit a Bluetooth signal that can be picked up by other devices to help track the item down.'
    },
    {
        title  :'MS Dhoni Believes He Who Panics Last Wins The Game, Says Michael Hussey',
        image  : 'https://c.ndtvimg.com/2020-04/j200su8_ms-dhoni-afp_625x300_14_April_20.jpg?output-quality=70&output-format=webp&downsize=555:*',
        content: "A finisher of repute himself, former Australia batsman Michael Hussey believes India's World Cup-winning former captain Mahendra Singh Dhoni's unbelievable power and self-belief make him the greatest of all time in that role. Dhoni is the greatest finisher of all time that the cricketing world has ever produced, Hussey told Sanjay Manjarekar on ESPNcricinfo's Videocast. Dhoni can keep his cool and make the opposition captain blink first. Dhoni also has unbelievable power. He knows that when he needs to clear the ropes he can do it. He has that kind of self-belief. Honestly, I didn't have that kind of belief in myself. The 44-year-old Hussey said he also picked up a trick or two about chasing from Dhoni while playing for Chennai Super Kings."
    },
    {
        title   :'Amazon fires three workers who criticized warehouse conditions',
        image   :'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQJGl32yuZIWhe90Ccgleda_JN0QPO8NTuxk07G4aJTaBuN7tpX&usqp=CAU',
        content :"Amazon has fired two tech workers after they spoke out publicly against warehouse conditions during the coronavirus pandemic. User experience designers Emily Cunningham and Maren Costa, both active members of the advocacy group Amazon Employees for Climate Justice, had offered match donations up to $500 for warehouse workers, citing insufficient protections. The company which had warned both employees about violating company policies earlier this year, confirmed the firings in a statement emailed to CNET. We support every employee's right to criticize their employer's working conditions, but that does not come with blanket immunity against any and all internal policies, an Amazon spokesperson said. We terminated these employees for repeatedly violating internal policies."
    },
    {
        title   :'Jobless after coronavirus layoffs, then struck by identity theft',
        image   :"https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRp2Mxzgl33YHIyUeJfs-JDGoQ4KZPXsMFHocNijeIFYL5I8IQE&usqp=CAU",
        content :"Getting laid off from a restaurant job was supposed to be the bad part. But when a server went to file for unemployment benefits in Colorado, a second nasty surprise was waiting. Someone else was already drawing benefits in the server's name, in another state. An identity thief had struck, and this was how the server found out. The thief used personal information like the server's name, birth date and social security number, according to a complaint the server filed with the US Federal Trade Commission. I have contacted Social Security Administration and they said there is nothing they can do since it doesn't list what state the claim was made, the server wrote. Therefore, I'm unable to get unemployment from a claim someone else made."
    }
]


    /* adding users for testing the signin and login functionality */
    blog.deleteMany({}, function(err) {
        if(err) {
            console.log(err);
        }
    }) 

    user.deleteMany({}, function(err) {
        if(err) {
            console.log(err);
        } else {
            blog_users = [
                {username: 'kishan', 
                    email   : 'kishan@gmail.com',
                    password: 'kishan123'},
                {username: 'jay', 
                    email   : 'jay@gmail.com',
                    password: 'jay123'}
            ]
            var user_data1 = user_service.register_user_data(blog_users[0]);
            user_data1.then(function(data) {
                add_blog(data, 0)
            })

            var user_data2 =  user_service.register_user_data(blog_users[1]);
            user_data2.then(function(data) {
                add_blog(data, 3)
            })
        }
    })

    function add_blog(data, index) {
        for(var i = index; i < index + 3; i++) {
            blog.create(blogs[i], function(err, blog_data) {
                if(err) {
                    console.log(err);
                } else {
                    user.findOne({email: data.email}, function(err, found_user) {
                        if(err) {
                            console.log(err);
                        } else {
                            found_user.user_blogs.push(blog_data._id);
                            found_user.save(function(err, data) {
                                if(err) {
                                    console.log(err) 
                                } 
                            })
                        }
                    })
                }
            });
        }
    } 
}
module.exports = init_db;

