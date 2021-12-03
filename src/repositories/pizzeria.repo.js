import Pizzeria from '../models/pizzeria.model.js';
import Order from '../models/order.model.js';
import orderRepo from './order.repo.js';

// import objectToDotNotation from '../libs/objectToDotNotation.js';
// import dayjs from 'dayjs';

class PizzeriaRepository {

    retrieveAllBySpeciality(retrieveOptions) {

        const retrieveQuery = Pizzeria.find()
            .skip(retrieveOptions.skip).limit(retrieveOptions.limit)
            .where('chef.speciality').equals(retrieveOptions.speciality)
            .sort('chef.name')
        const countQuery = Pizzeria.find({ 'chef.speciality': retrieveOptions.speciality }).count();

        return Promise.all([retrieveQuery, countQuery]);


    }

    retrieveAll(retrieveOptions) {

        const retrieveQuery = Pizzeria.find()
            .skip(retrieveOptions.skip).limit(retrieveOptions.limit)
            .sort('chef.name')
        const countQuery = Pizzeria.countDocuments();

        return Promise.all([retrieveQuery, countQuery]);


    }


    retrieveByID(id, wantsOrders) {
        const retrieveResponse = Pizzeria.findById(id)

        if (wantsOrders)
            retrieveResponse.populate('orders')

        return retrieveResponse
    }

    transform(pizzeria, transformOptions = { }) {
        if (transformOptions.embed && transformOptions.embed.orders) {
            pizzeria.orders = pizzeria.orders.map(order => {
                return orderRepo.transform(order)
            })
        }

        pizzeria.href = `/${pizzeria.id}`

        delete pizzeria._id
        delete pizzeria.id

        return pizzeria
    }
}

export default new PizzeriaRepository()
