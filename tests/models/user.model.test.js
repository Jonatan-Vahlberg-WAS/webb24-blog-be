const User = require("../../models/user.model")

describe("User model", function() {

    beforeEach(function() {
        this.validUserData = {
            email: "email@test.com",
            password: "12345678abc",
            name: "Test testsson"
        }
    }) 

    test("should create a valid user", async function() {
        const user = await User.create(this.validUserData)
        
        expect(user.email).toBe(this.validUserData.email)
        expect(user.name).toBe(this.validUserData.name)
        expect(user.password).not.toHaveLength(0)
        expect(user.password).not.toBe(this.validUserData.password)
        expect(user.isAdmin).toBe(false); // Default value
    })

    test("should not create a valid user with invalid data", async function() {
        const user = new User({ email: this.validUserData })
        let err;
        try {
            await user.save()
        } catch(error) {
            err = error
        }
        expect(err).toBeDefined();
        expect(err.errors.password).toBeDefined();
        expect(err.errors.name).toBeDefined();
    })

    test("should not create a user with duplicate email", async function() {
        const user1 = await User.create(this.validUserData)
        let err;
        const user2 = new User(this.validUserData)
        try {
            await user2.save()
        } catch (error) {
            err = error
        }
        expect(err).toBeDefined()
        expect(err.code).toBe(11000) // Duplicate
    })

    test("should not create a user with incorrect password", async function() {
        const user = new User({
            ...this.validUserData,
            password: "1234"
        })
        let err;
        try {
            await user.save()
        } catch (error) {
            err = error
        }
        expect(err).toBeDefined()
        expect(err.errors.password.message).toContain("is shorter than the minimum allowed length (8)")
    })


})