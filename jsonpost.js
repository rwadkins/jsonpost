(function(global) {


    function jsonpost(url, payload, options) {
        var jsp = new Jsonpost(url, payload, options);
        jsp.execute();

    }

    function Jsonpost (url, payload, options) {
        this.url = url;
        this.payload = payload;
        this.options = options;
        this.options.uuid = uuid();
    }

    Jsonpost.prototype.execute = function() {
        // bind to message event 
        var binding = new EventListener(this.options);
        binding.addEvent();
        // create frame
        var frame = new Frame(this.options).create().append();

        var form = new Form(this.options).create(this.url).fill(this.payload).append().submit();

    };

    /*
        ######################################
        # Frame

    */
    function Frame(options) {
        this.options = options;
        if (! global.document) {
            this.options.callback({
                type: "nodocument",
                message: "No document object on the global object"
            }, null);
        }
    }

    Frame.prototype.create = function() {
        this.domNode = global.document.createElement("iframe");

        this.domNode.name = "frame" + this.options.uuid;
        this.domNode.id = "frame" + this.options.uuid;
        this.domNode.style.display = "none";

        return this;
    };

    Frame.prototype.append = function() {
        global.document.body.appendChild(this.domNode);
        return this;
    };

    /*
        ######################################
        # Form

    */

    function Form(options) {
        this.options = options;
        this.formNodes = [];
    }

    Form.prototype.create = function(url) {
        this.domNode = global.document.createElement("form");

        this.domNode.setAttribute("name", "form" + this.options.uuid);
        this.domNode.setAttribute("method", "post");
        this.domNode.action = url;
        this.domNode.setAttribute("target", "frame" + this.options.uuid);
        this.domNode.style.display = "none";

        return this;
    };

    Form.prototype.fill = function(payload) {
        var uuidInput = new Input({
            name: "uuid",
            value: this.options.uuid
        });

        var payloadInput = new Input({
            name: "payload",
            value: JSON.stringify(payload)
        });

        uuidInput.create().append(this);
        payloadInput.create().append(this);

        this.formNodes.push(uuidInput, payloadInput);

        return this;
    };

    Form.prototype.append = function() {
        global.document.body.appendChild(this.domNode);
        return this;
    };

    Form.prototype.submit = function() {
        this.domNode.submit();

        return this;
    };

    /*
        ######################################
        # Input

    */

    function Input(input) {
        this.name = input.name;
        this.value = input.value;
    }

    Input.prototype.create = function() {
        this.domNode = global.document.createElement("input");

        this.domNode.setAttribute("name", this.name);
        this.domNode.setAttribute("value", this.value);
        this.domNode.setAttribute("type", "hidden");

        return this;
    };

    Input.prototype.append = function(form) {
        form.domNode.appendChild(this.domNode);

        return this;
    };

    /*
        ######################################
        # Callback Message Handling

    */
    eventHub = {};
    eventBinding = false;

    function EventListener(options) {
        this.options = options;
    }

    EventListener.prototype.addEvent = function() {
        if (! eventBinding) {
            global.addEventListener("message", this.callback.bind(this), false);
            eventBinding = true;
        }

        eventHub[this.options.uuid] = true;

        this.eventTimeOutHandle = global.setTimeout(this.timeoutCallback.bind(this), this.options.timeout || 5000);
    };

    EventListener.prototype.removeEvent = function() {
        global.clearTimeout(this.eventTimeOutHandle);
        delete eventHub[this.options.uuid];

        if(Object.keys(eventHub)) {
            eventBinding = false;
            global.removeEventListener("message", this.callback.bind(this), false);
        }
    };

    EventListener.prototype.callback = function(evt) {
        // TODO: add a domain check to this from the url.

        if (eventHub[this.options.uuid] && evt.data.uuid === this.options.uuid) {
            if(evt.origin) {
                this.options.callback(null, evt.data.payload);
            }
            this.removeEvent();
        }
    };

    EventListener.prototype.timeoutCallback = function() {
        this.options.callback({
            type: "timeout",
            message: "The Post operation timed out"
        }, null);
    };



    /*
        Version 4 UUID.
        Technique adapted from 
        http://slavik.meltser.info/?p=142
        Modified to be V4 compliant
    */
    function uuid() {
        function _p8(s) {
            var p = (Math.random().toString(16)+"000000000").substr(2,8);
            return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
        }
        var uid = _p8() + _p8(true) + _p8(true) + _p8();

        // replace the version and reserved characters,
        uid = uid.replace(/^(.{14}).(.{4})./, "$14$2" + (parseInt(uid.substr(19,1),16)&0x3|0x8).toString(16));
        
        return uid;
    }

    global.jsonpost = jsonpost;


})(window);