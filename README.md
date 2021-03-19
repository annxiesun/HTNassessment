### Project Link: https://annie-htn-challenge.herokuapp.com/login, username: 123, password: 456

### Question 1
I used React in my application because I like how it makes it simple to think of the site in smaller pieces & update the screen as needed. For the functionality and development, I first break down a page into multiple components. For example in the page that shows all the events, I broke it down into a card-view version that shows the basic information & a sub-page that shows all the information.  I also think about parent-child relationships & where each state should be located so it can be passed down. For example, the logged_in state is at the App level (the highest), because it affects both the login page & the event page. 

One thing I'm really proud of is the layout of the event page. I think the filters on the side make it easy for the user to see all the events while searching. Each card also has the most relevant information while not being too crowded. Another small thing I would like to point out is that the event types are dynamic, so if you would add another event type, let's say "Contest", it would automatically appear in the input box to filter by. 

A problem I encountered while developing this project was in the filtering functionality. I first was trying to add a state 'shown_events' so the 'all_events' state was not modified. This ended up being hard because my events were being sorted inside the EventContainer component. I solved this by making 'filter' a state and passing that to the EventContainer so that it could filter & sort in the same place.

### Question 2
To scale this project, I first would add pagination for the events so it doesn't take too long to load into the page. I would then add a lot more to the search functionality:

 - Change the filter dropdown menu into checkboxes, so the user can see all the events they are interested in. 
 - Improve the search function so it doesn't just search by name but also speakers
 - Allow the user to filter by what day the event is on and what time they happen

I also would add a warning when the user clicks 'log out' because it is very simple to accidentally log out as of now, as well as redirect them to another page when they log out to make the action more meaningful.
