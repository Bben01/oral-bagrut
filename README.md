# [Oral bagrut](https://oral-bagrut.web.app/)

A website made to ease student distribution to the teachers during oral tests.

### The problem 

In a normal situation, students start their tests in a classroom and let the room supervisor know when they are ready to pass their tests. The examiners then go to the rooms to take a student with them.
This action takes a lot of time and can be unfair to some students who wait for a long time in the classroom.

### The solution

I created a tool that allows supervisors to make a list of available students in the room they are and receive a notification when a teacher is ready to take a student.

## How does it work?

### For the administrator

You can create a session by clicking on the ```Create test``` button. After that, you have to log in (or create an account) and enter a 6-digit PIN and a password (6 character minimum). 

You then access the dashboard, where you can have information about the classrooms and the students.  You can also share a link to join the session quickly for the supervisors and the teachers. 

You can delete the session after the test.

If you disconnect from the webpage, you can access it with the ```create test``` button and by entering the PIN and the password again.

### For the Supervisor

The Supervisor is someone watching over the classroom during the examination. When they arrive there, they have to enter the session the admin created using the PIN and the password, or with the link provided. Then they have to give information about the classroom they are in and their name. During the test, when a student is available for oral testing, the Supervisor enters their name in the webpage. He will get a notification when he has to send a student with the name of the Examinator and his room.

### For the Examinator

The Examinator is the teacher testing the student. As the Supervisor, they enter their name and the room they are testing. When they are ready to test a student, they click on the ```Next Student``` button. If a student is available, the Supervisor sends him immediately to your room. However, if no student is available, a Supervisor will send one when he is ready. When the student finishes his test,  you can click on the ```End test``` button.

---

If you want to base you own website on this one, you can:

- Clone the project
- ```npm install```
- Create a firebase project
- Use your token in ```/src/environments/environment.ts```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.7.



