
const sum = (a,b) => a+b;

test("sum should return the sum of two numbers", function () {
    expect(sum(2,3)).toBe(5)
})

const getEmailHostOrThrow = (email = "") => {
    const splitEmail = email.split("@")
    if(!splitEmail?.[1]) {
        throw new Error("Not a valid email")
    }
    return splitEmail?.[1]
}

describe("getEmailHostOrThrow", () => {

    test("gets host from valid email", function () {
        const validEmail = "example@test.com"

        const host = getEmailHostOrThrow(validEmail)
        expect(host).toBe("test.com")
    })

    test("does not get host from invalid email", function () {
        const validEmail = "example."
        let err;
        try {
            getEmailHostOrThrow(validEmail)
        } catch (error) {
            err = error
        }
        expect(err.message).toContain("Not a valid email")
    })
})