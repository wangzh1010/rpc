class Registry {
    constructor() {
        this.services = {};
    }
    register(service) {
        if (!this.services[service.method]) {
            this.services[service.method] = [];
        }
        this.services[service.method].push(service);
    }
    unRegister() {

    }
    subscribe() {

    }
    unsubscribe() {

    }
}
module.exports = Registry
