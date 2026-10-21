'use strict';

module.exports = function(User) {
    // Puedes agregar hooks (boot scripts o remoting hooks) personalizados aquí si lo necesitas
    User.afterRemote('create', function(context, user, next) {
        console.log('> Usuario registrado exitosamente:', user.email);
        next();
    });
};