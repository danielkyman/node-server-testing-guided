const request = require("supertest");

const server = require("./server.js");
const db = require("../data/dbConfig.js");

describe("server", function () {
  describe("GET /", function () {
    it("should return 200 OK", function () {
      return request(server)
        .get("/")
        .then((res) => {
          expect(res.status).toBe(200);
        });
    });
  });

  describe("POST /hobbits", () => {
    beforeEach(async () => {
      await db("hobbits").truncate();
    });
    it("return 201 on success", () => {
      return request(server)
        .post("/hobbits")
        .send({ name: "testHobbit" })
        .then((res) => {
          expect(res.status).toBe(201);
        });
    });
    it("should return a message saying, Hobbit created successfully ", () => {
      return request(server)
        .post("/hobbits")
        .send({ name: "testHobbit" })
        .then((res) => {
          expect(res.body.message).toBe("Hobbit created successfully");
        });
    });
    it("add the hobbit to the db ", async () => {
      const hobbitName = "testHobbit";
      const existing = await db("hobbits").where({ name: hobbitName });
      expect(existing).toHaveLength(0);
      await request(server)
        .post("/hobbits")
        .send({ name: hobbitName })
        .then((res) => {
          expect(res.body.message).toBe("Hobbit created successfully");
        });

      await request(server)
        .post("/hobbits")
        .send({ name: hobbitName })
        .then((res) => {
          expect(res.body.message).toBe("Hobbit created successfully");
        });

      const inserted = await db("hobbits"); // .where({ name: hobbitName });
      expect(inserted).toHaveLength(2);
    });
  });
});
