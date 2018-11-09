import React from "react";
import MNavbar from "./MNavbar";

export default class Home extends React.Component {
  state = { quote: '' };

  componentDidMount() {
    this.generateQuote();
    this.task = setInterval(this.generateQuote, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.task);
  }

  render() {
    const { role, username } = this.props;

    return (
      <React.Fragment>
        <MNavbar
          doLogout={this.props.doLogout}
          role={role}
          username={username}
        />
        <div className="background">
          <div className="header" />
          <div className="quote">{this.state.quote}</div>
        </div>
      </React.Fragment>
    );
  }

  generateQuote = () => {
    let quotes = [
      "Let our advance worrying become advance thinking and planning. - Winston Churchill",
      "Plans are worthless. Planning is essential. - Dwight D. Eisenhower",
      "Plans are only good intentions unless they immediately degenerate into hard work. - Peter Drucker",

      "Those who plan do better than those who do not plan even though they rarely stick to their plan.  - Winston Churchill",
      "If you don't know where you are going. How can you expect to get there? - Basil S. Walsh",
      "A good plan can help with risk analyses but it will never guarantee the smooth running of the project. - Bentley and Borman",
      "The single biggest problem in communication is the illusion that it has taken place. - George Bernard Shaw",
      "The most important thing in communication is hearing what isn't said. - Peter Drucker",
      "Brevity is the soul of wit. - William Shakespeare",
      "Communication is a skill that you can learn. It's like riding a bicycle or typing. If you're willing to work at it, you can rapidly improve the quality of every part of your life. - Brian Tracy",
      "To effectively communicate, we must realize that we are all different in the way we perceive the world and use this understanding as a guide to our communication with others.- Tony Robbins",
      "My belief is that communication is the best way to create strong relationships. - Jada Pinkett Smith",
      "The major reason for setting a goal is for what it makes of you to accomplish it. What it makes of you will always be the far greater value than what you get. - Jim Rohn",
      "Goals are dreams with deadlines. - Diana Scharf",
      "Vision without action is a dream. Action without vision is simply passing the time. Action with Vision is making a positive difference. - Joel Barker",
      "He who has a ‘why’ to live for can bear with almost any ‘how’. - Friedrich Nietzsche",
      "Unity is strength... when there is teamwork and collaboration, wonderful things can be achieved. - Mattie Stepanek",
      "Talent wins games, but teamwork and intelligence wins championships. - Michael Jordan",
      "As you navigate through the rest of your life, be open to collaboration. Other people and other people's ideas are often better than your own. Find a group of people who challenge and inspire you, spend a lot of time with them, and it will change your life. - Amy Poehler",
      "Collaboration is the best way to work. It's only way to work, really. Everyone's there because they have a set of skills to offer across the board.- Antony Starr "
    ];

    let randomQuote = Math.floor(Math.random() * 20);
    this.setState({quote: quotes[randomQuote]});
  };

}
