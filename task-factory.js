'use strict';

var TaskFactory = {

	create: function(type, cfg) {
		
		cfg = cfg || [];
		var tasks = [];

		if (Array.isArray(cfg)) {

			for (let i=0,len=cfg.length; i<len; i++) {
				
				let name = type + ':' + (cfg[i].name || i );
				this._doCreate(name, type, cfg[i]);
				tasks.push(name);
			}

			return tasks;
		}

		let name = type + ':' + (cfg.name || 1);
		this._doCreate(name, type, cfg);
		tasks.push(name);

		return tasks;
	},

	_doCreate (name, type, cfg) {
		(new (require('./tasks/'+ type))(name, cfg));
	}
}

module.exports = TaskFactory;