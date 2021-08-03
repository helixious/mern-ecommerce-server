import faker from "faker";

const newUser = () => {
    let firstName = faker.name.findName();
    let lastName = faker.name.lastName();
    let city = faker.address.city();
    let state = faker.address.stateAbbr();
    let zip = faker.address.zipCodeByState(state);
    let country = "United States";
    let address = faker.address.streetAddress();
    let username = faker.internet.userName();
    let email = faker.internet.email();
    let password = faker.internet.password();

    return JSON.stringify({firstName, lastName, city, state, zip, country, address, username, email, password},0,4);
}


let userA = newUser();
console.log(userA)