//GET SEARCH PAGE
router.get(
    '/',
    asyncHandler(async (req, res) => {
      const questions = await Question.findAll({
        include: [Answer, User],
        order: [['createdAt', 'DESC']],
      });
      //add something
      questions.find().toArray(function(searchResults){
        res.send(searchResults)
      })

      const user = await User.findByPk(req.session.auth.userId)
      //console.log(user)
      if (req.session.auth) {
        questions.forEach((question, i) => {
          if ((question.userId === req.session.auth.userId)) {
            question.isAuthorized = true;
          }

          question.colorIndex = i % 5;

        });
      }
      res.render('index', {
        title: 'Meme Overflow',
        questions,
        user,
        isLoggedIn: req.session.auth,
        currentUser: res.locals.user ? res.locals.user : undefined,
      });
    }));

    router.post(
        '/',
        asyncHandler(async (req, res) => {
          const questions = await Question.findAll({
            include: [Answer, User],
            order: [['createdAt', 'DESC']],
          });
          //add search result function 
          questions.find().toArray(function(searchResults){
            res.send(searchResults)
          })

          const user = await User.findByPk(req.session.auth.userId)
          //console.log(user)
          if (req.session.auth) {
            questions.forEach((question, i) => {
              if ((question.userId === req.session.auth.userId)) {
                question.isAuthorized = true;
              }

              question.colorIndex = i % 5;

            });
          }
          res.render('index', {
            title: 'Meme Overflow',
            questions,
            user,
            isLoggedIn: req.session.auth,
            currentUser: res.locals.user ? res.locals.user : undefined,
          });
        }));
