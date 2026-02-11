import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";

actor {
  type WorkerId = Nat;
  type Worker = {
    id : WorkerId;
    name : Text;
    phone : ?Text;
    dailyWageRupees : Nat;
  };

  type AttendanceStatus = {
    #full;
    #half;
    #morningEvening;
    #absent;
  };

  type AttendanceRecord = {
    workerId : WorkerId;
    date : Text; // "YYYY-MM-DD"
    status : AttendanceStatus;
  };

  var nextWorkerId = 1;
  let workers = Map.empty<WorkerId, Worker>();
  let attendanceRecords = Map.empty<Text, List.List<AttendanceRecord>>();
  let passcodes = Map.empty<Principal, Text>();

  module Text {
    public func compare(a : Text, b : Text) : Order.Order {
      a.compare(b);
    };
  };

  func toTuple(record : AttendanceRecord) : (WorkerId, Text, AttendanceStatus) {
    (record.workerId, record.date, record.status);
  };

  func fromTuple(tuple : (WorkerId, Text, AttendanceStatus)) : AttendanceRecord {
    let (workerId, date, status) = tuple;
    {
      workerId;
      date;
      status;
    };
  };

  // Worker CRUD
  public shared ({ caller }) func createWorker(name : Text, phone : ?Text, dailyWageRupees : Nat) : async WorkerId {
    let id = nextWorkerId;
    nextWorkerId += 1;
    let worker : Worker = {
      id;
      name;
      phone;
      dailyWageRupees;
    };
    workers.add(id, worker);
    id;
  };

  public query ({ caller }) func getAllWorkers() : async [Worker] {
    workers.values().toArray();
  };

  // Attendance management
  public shared ({ caller }) func setAttendance(workerId : WorkerId, date : Text, status : AttendanceStatus) : async () {
    let record : AttendanceRecord = {
      workerId;
      date;
      status;
    };

    let recordsForDate = switch (attendanceRecords.get(date)) {
      case (null) { List.empty<AttendanceRecord>() };
      case (?existing) { existing };
    };

    let filteredRecords = recordsForDate.filter(
      func(r) { r.workerId != workerId }
    );

    filteredRecords.add(record);
    attendanceRecords.add(date, filteredRecords);
  };

  public shared ({ caller }) func clearAttendance(workerId : WorkerId, date : Text) : async () {
    switch (attendanceRecords.get(date)) {
      case (null) { () };
      case (?recordsForDate) {
        let newRecords = recordsForDate.filter(
          func(r) { r.workerId != workerId }
        );
        attendanceRecords.add(date, newRecords);
      };
    };
  };

  public query ({ caller }) func getAttendanceForMonth(workerId : WorkerId, month : Text) : async [AttendanceRecord] {
    let allRecords = List.empty<AttendanceRecord>();

    for ((date, records) in attendanceRecords.entries()) {
      if (date.contains(#text month)) {
        for (record in records.values()) {
          if (record.workerId == workerId) {
            allRecords.add(record);
          };
        };
      };
    };

    allRecords.toArray();
  };

  // Passcode management
  public shared ({ caller }) func setPasscode(passcode : Text) : async () {
    passcodes.add(caller, passcode);
  };

  public query ({ caller }) func checkPasscode(passcode : Text) : async Bool {
    switch (passcodes.get(caller)) {
      case (null) { false };
      case (?storedPasscode) { storedPasscode == passcode };
    };
  };
};
