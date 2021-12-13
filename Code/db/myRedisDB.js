const { createClient } = require("redis");

async function getRConnection() {
  let rclient = createClient();
  rclient.on("error", (err) => console.log("Redis Client Error", err));
  await rclient.connect();

  console.log("redis connected");
  return rclient;
}

async function getCourses(query, page, pageSize) {
  console.log("getCourses", query);

  let rclient;

  try {
    rclient = await getRConnection();
    let courseIDs = await rclient.zRangeWithScores("courseList", (page - 1) * pageSize, page * pageSize - 1);
    console.log(courseIDs);
    //console.log(courseIDs);
    let courses = [];
    for (let cID of courseIDs) {
      let cKey = "course:" + cID.value;
      let course = await rclient.hGetAll(cKey);
      //console.log(course);
      courses.push(course);
    }
    return courses;
  } finally {
    rclient.quit();
  }
}

async function getCoursesCount(query) {
  console.log("getCoursesCount", query);

  try {
    rclient = await getRConnection();
    let count = await rclient.get("courseID") - 1;
    return count;
  } finally {
    rclient.quit();
  }
}

async function getCourseByID(courseID) {
  console.log("getCourseByID", courseID);

  try {
    rclient = await getRConnection();
    let cKey = "course:" + courseID;
    let course = await rclient.hGetAll(cKey);
    console.log(course);
    return course;
  } finally {
    rclient.quit();
  }
}

async function updateCourseByID(courseID, course) {
  console.log("updateCourseByID", courseID, course);

  try {
    rclient = await getRConnection();
    let cKey = "course:" + courseID;
    const updatedCourse = await rclient.hSet(cKey, {
      "courseID": courseID, "courseName": course.courseName,
      "carType": course.carType, "startTime": course.startTime,
      "duration": course.duration, "courseInfo": "",
      "capacity": course.capacity,
    });
    return updatedCourse;
  } finally {
    rclient.quit();
  }
}

async function deleteCourseByID(courseID) {
  console.log("deleteCourseByID", courseID);

  try {
    rclient = await getRConnection();
    let cKey = "course:" + courseID;
    let coachKey = "course:" + courseID + ":coach";
    await rclient.ZREM("courseList", courseID);
    await rclient.del(coachKey);
    const delCourse = await rclient.del(cKey);
    return delCourse;
  } finally {
    rclient.quit();
  }
}

async function insertCourse(course) {
  console.log("insertCourse");

  try {
    rclient = await getRConnection();
    let cKey = "course:" + course.courseID;
    const updatedCourse = await rclient.hSet(cKey, {
      "courseID": course.courseID, "courseName": course.courseName,
      "carType": course.carType, "startTime": course.startTime,
      "duration": course.duration, "courseInfo": "",
      "capacity": course.capacity,
    });
    let coachKey = "course:" + course.courseID + ":coach";
    await rclient.hSet(coachKey, {
      "courseID": course.courseID,
      "firstName": course.firstName, "lastName": course.lastName,
      "registerOn": new Date("12/14/2021"), "location": "",
      "phoneNumebr": "", "ratings": "",
    });
    let cID = await rclient.get("courseID");
    await rclient.ZADD("courseList", {score: -cID, value: cID});
    await rclient.incr("courseID");
    return updatedCourse;
  } finally {
    rclient.quit();
  }
}


async function getStudentsByCourseID(courseID) {
  console.log("getStudentsByCourseID", courseID);
  try {
    rclient = await getRConnection();
    let cKey = "course:" + courseID + ":students";
    //console.log(cKey);
    let studentIDs = await rclient.sMembers(cKey);
    let students = [];
    for (let sID of studentIDs) {
      //console.log(sID);
      let sKey = "student:" + sID;
      let student = await rclient.hGetAll(sKey);
      
      students.push(student);
    }
    return students;
  } finally {
    rclient.quit();
  }

}


async function addStudentIDToCourseID(courseID, studentID) {
  console.log("addStudentIDToCourseID", courseID, studentID);
  
  try {
    rclient = await getRConnection();
    let cKey = "course:" + courseID + ":students";
    let add = await rclient.SISMEMBER("studentList", studentID);
    console.log(add);
    if (add == 1) await rclient.SADD(cKey, studentID);
    return add;
  } finally {
    rclient.quit();
  }
}

async function insertStudent(student) {
  console.log("insertStudent");

  try {
    rclient = await getRConnection();
    let sKey = "student:" + student.studentID;
    const addedStudent = await rclient.hSet(sKey, student);
    return addedStudent;
  } finally {
    rclient.quit();
  }
}

async function deleteStudentIDFromCourseID(courseID, studentID) {
  console.log("deleteStudentIDFromCourseID", courseID, studentID);
  
  try {
    rclient = await getRConnection();
    let sKey = "course:" + courseID + ":students";
    const delStudent = await rclient.SREM(sKey, studentID);
    return delStudent;
  } finally {
    rclient.quit();
  }
  
}





module.exports.getCourses = getCourses;
module.exports.getCoursesCount = getCoursesCount;
module.exports.insertCourse = insertCourse;
module.exports.getCourseByID = getCourseByID;
module.exports.updateCourseByID = updateCourseByID;
module.exports.deleteCourseByID = deleteCourseByID;
module.exports.getStudentsByCourseID = getStudentsByCourseID;
module.exports.addStudentIDToCourseID = addStudentIDToCourseID;
module.exports.insertStudent = insertStudent;
module.exports.deleteStudentIDFromCourseID = deleteStudentIDFromCourseID;
//module.exports.search = search;
