const { createClient } = require("redis");
const { MongoClient, Long } = require("mongodb");
const uri = process.env.MONGO_URL || "mongodb://localhost:27017";
async function load() {
  let clientRedis;
  let clientMongo;
  let db, colCourse, colStudent;
  try {
    clientRedis = createClient();
    clientMongo = new MongoClient(uri);
    clientRedis.on("error", (err) => console.log("Redis Client Error", err));
    await clientMongo.connect();
    console.log("Redis connected");
    await clientRedis.connect();
    console.log("Mongo connected");
    await clientRedis.set("courseID", "1");
    await clientRedis.set("studentID", "1");
    db = clientMongo.db("Project2");
    colCourse = db.collection("Courses");
    colStudent = db.collection("Students");
    let courses = await colCourse.find().toArray();
    let students = await colStudent.find().toArray();
    for (let course of courses) {
        let cID = await clientRedis.get("courseID");
        await clientRedis.ZADD("courseList", {score: -cID, value: cID});
        console.log("course list updated");
        let courseKey = "course:" + cID;
        let coachKey = "course:" + cID + ":coach";
        let studentsKey = "course:" + cID + ":students";
        //console.log(courseKey, coachKey, studentsKey);
        await clientRedis.HSET(courseKey, {
            "courseID": course.courseID,
            "courseName": course.courseName, "carType": course.carType, 
            "startTime": course.startTime, "duration": course.duration, 
            "courseInfo": "", "capacity": course.capacity,
        });
        console.log("course added");
        await clientRedis.hSet(coachKey,{
            "courseID": course.courseID,
            "firstName": course.coach.firstName,
            "lastName": course.coach.lastName,
            "registerOn": course.coach.registerOn,
            "location": course.coach.location,
            "phoneNumber": course.coach.phoneNumber,
            "ratings": course.coach.ratings,
        });
        console.log("coach added");
        for (let student of course.students) {
            //console.log(studentsKey);
            await clientRedis.sAdd(studentsKey, student.sID+"");
        }
        await clientRedis.incr("courseID");
    }

    for (let student of students) {
        let studentKey = "student:" + student.studentID + "";
        await clientRedis.hSet(studentKey,{
            "studentID": student.studentID,
            "firstName": student.firstName,
            "lastName": student.lastName,
            "gender": student.gender,
            "phoneNumber": student.phoneNumber,
            "email": student.email,
            "address": student.address,
        })
        console.log("student added");
        await clientRedis.incr("studentID");
    }
  } finally {
    await clientRedis.quit();
    await clientMongo.close();
  }
}
module.exports.load = load;
load();