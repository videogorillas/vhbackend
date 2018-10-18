/**
 * @version 4.2.0.0
 * @copyright Copyright © ProductiveRage 2018
 * @compiler Bridge.NET 17.1.0
 */
Bridge.assembly("Bridge.React", function ($asm, globals) {
    "use strict";

    Bridge.define("Bridge.React.ActionMatchOptions", {
        $kind: "enum",
        statics: {
            fields: {
                handled: 0,
                ignored: 1
            }
        }
    });

    Bridge.define("Bridge.React.IDispatcher", {
        $kind: "interface"
    });

    /**
     * @memberof System
     * @callback System.Func
     * @param   {TState}    arg1    
     * @param   {TProps}    arg2
     * @return  {TState}
     */

    /** @namespace System */

    /**
     * @memberof System
     * @callback System.Action
     * @return  {void}
     */

    /** @namespace Bridge.React */

    /**
     * This provides a class which may be derived from in order to declare React components. Due to the way that React initialises components, it is important that derived classes
     do not perform any logic or initialisation in their constructor, nor may they have any other configuration passed into their constructor but that which is described by the
     props (and state, where applicable) data. The constructors will not be executed and so any logic or member initialisation in there will be silenty ignored (this is due to
     the fact that C# has to be able to support multiple constructor overloads but JavaScript does not and React is built on this assumption).
     *
     * @abstract
     * @public
     * @class Bridge.React.Component$2
     */
    Bridge.define("Bridge.React.Component$2", function (TProps, TState) { return {
        statics: {
            fields: {
                _reactComponentClasses: null
            },
            ctors: {
                init: function () {
                    this._reactComponentClasses = new (System.Collections.Generic.Dictionary$2(Function,System.Object))();
                }
            },
            methods: {
                op_Implicit: function (component) {
                    // Since React 0.11 (see https://facebook.github.io/react/blog/2014/07/17/react-v0.11.html), it has been acceptable to return null from a Render method to
                    // indicate that nothing should be rendered. As such, it's possible that a null Component reference will pass through this operator method and so null needs
                    // to be allowed (previously this would throw a ArgumentNullException for a null component).
                    if (component == null) {
                        return null;
                    }
                    return component._reactElement;
                },
                op_Implicit$1: function (component) {
                    // Since React 0.11 (see https://facebook.github.io/react/blog/2014/07/17/react-v0.11.html), it has been acceptable to return null from a Render method to
                    // indicate that nothing should be rendered. As such, it's possible that a null Component reference will pass through this operator method and so null needs
                    // to be allowed (previously this would throw a ArgumentNullException for a null component).
                    if (component == null) {
                        return null;
                    }
                    return component._reactElement;
                }
            }
        },
        fields: {
            _reactElement: null
        },
        props: {
            /**
             * Props is not used by all components and so this may be null
             *
             * @instance
             * @protected
             * @readonly
             * @memberof Bridge.React.Component$2
             * @function unwrappedProps
             * @type TProps
             */
            unwrappedProps: {
                get: function () {
                    return Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(this.props);
                }
            },
            /**
             * State is not used by all components and so this may be null
             *
             * @instance
             * @protected
             * @readonly
             * @memberof Bridge.React.Component$2
             * @function unwrappedState
             * @type TState
             */
            unwrappedState: {
                get: function () {
                    return Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(this.state);
                }
            },
            /**
             * This will never be null nor contain any null references, though it may be empty if there are no children to render
             *
             * @instance
             * @protected
             * @readonly
             * @memberof Bridge.React.Component$2
             * @function children
             * @type Array.<System.Object>
             */
            children: {
                get: function () {
                    // See notes in PureComponent's Children property for details about what's going on here
                    return this.props && this.props.children ? (Array.isArray(this.props.children) ? this.props.children : [this.props.children]) : [];
                }
            }
        },
        ctors: {
            ctor: function (props, children) {
                if (children === void 0) { children = []; }

                this.$initialize();
                // To ensure that a single "template" (ie. React component) is created per unique class, a static "_reactComponentClasss" dictionary is maintained. If it has no entry
                // for the current type then this must be the first instantiation of that type and so a component class will be created and added to the dictionary, ready for re-use
                // by any subsequent component instances.
                var currentType = Bridge.getType(this); // Cast to object first in case derived class uses [IgnoreGeneric] - see http://forums.bridge.net/forum/bridge-net-pro/bugs/3343
                var reactComponentClass = { };
                if (!Bridge.React.Component$2(TProps,TState)._reactComponentClasses.tryGetValue(currentType, reactComponentClass)) {
                    reactComponentClass.v = Bridge.React.ReactComponentClassCreator.createClass(this, Bridge.React.Component$2(TProps,TState));
                    Bridge.React.Component$2(TProps,TState)._reactComponentClasses.set(currentType, reactComponentClass.v);
                }

                // Now that the React component class is certain to have been defined (once per unique C# component class), this instance requires a React element to be created
                // for it. The internal React mechanism means that the component's constructor will not be executed, which is why ALL state and configuration options for a
                // component must be contained within the props (and state, where appropriate). Note: In most cases where children are specified as a params array, we don't want
                // the "children require unique keys" warning from React (you don't get it if you call DOM.Div(null, "Item1", "Item2"), so we don't want it in most cases here
                // either - to achieve this, we prepare an arguments array and pass that to React.createElement in an "apply" call.
                var createElementArgs = System.Array.init([reactComponentClass.v, Bridge.React.ComponentPropsHelpers.wrapProps(props)], System.Object);
                if (children != null) {
                    createElementArgs = createElementArgs.concat.apply(createElementArgs, children);
                }
                this._reactElement = React.createElement.apply(null, createElementArgs);
            }
        },
        methods: {
            /**
             * When writing React components in JavaScript, it is recommended that they be constructed as classes that are derived from React.Component and that any initial-state setting be
             done in the constructor (for this reason, GetInitialState is not support for JavaScript class-based React components). However, JavaScript does not have to support multiple
             constructor signatures, unlike C#, which makes things easier for JavaScript React; with these bindings, multiple constructors signatures ARE supported but they will not be
             called during component initialisation and so must not contain any code (there is an analyser to identify any time that this rule has been forgotten). Since constructors
             are not executed, the GetInitialState is still the way to set initial state. Note: State is not used by all components and so it is valid to return null from any
             implementation of this function.
             *
             * @instance
             * @protected
             * @this Bridge.React.Component$2
             * @memberof Bridge.React.Component$2
             * @return  {TState}
             */
            constructorStateInitialiser: function () {
                return Bridge.getDefaultValue(TState);
            },
            componentWillMount: function () { },
            /**
             * Props is not used by all components and so it is valid for the nextProps reference passed up here to be null
             *
             * @instance
             * @protected
             * @this Bridge.React.Component$2
             * @memberof Bridge.React.Component$2
             * @param   {TProps}    nextProps
             * @return  {void}
             */
            componentWillReceivePropsWrapped: function (nextProps) { },
            componentWillReceiveProps: function (nextPropsIfAny) {
                this.componentWillReceivePropsWrapped(Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(nextPropsIfAny));
            },
            /**
             * If this returns false then the proposed component update will be cancelled - this may be used as an optimisation to avoid unnecessary updates. Since deep equality
             checks can be expensive, taking advantage of this mechanism is easiest when the props and state types are immutable and so equality checks are as simple (and cheap)
             as a reference equality test. Props and State are not used by all components and so it is valid for either or both of the nextProps and nextState references passed
             up here to be null.
             *
             * @instance
             * @protected
             * @this Bridge.React.Component$2
             * @memberof Bridge.React.Component$2
             * @param   {TProps}     nextProps    
             * @param   {TState}     nextState
             * @return  {boolean}
             */
            shouldComponentUpdateWrapped: function (nextProps, nextState) {
                return true;
            },
            shouldComponentUpdate: function (nextPropsIfAny, nextStateIfAny) {
                return this.shouldComponentUpdateWrapped(Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(nextPropsIfAny), Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(nextStateIfAny));
            },
            /**
             * Props and State are not used by all components and so it is valid for either or both of the nextProps and nextState references passed up here to be null
             *
             * @instance
             * @protected
             * @this Bridge.React.Component$2
             * @memberof Bridge.React.Component$2
             * @param   {TProps}    nextProps    
             * @param   {TState}    nextState
             * @return  {void}
             */
            componentWillUpdateWrapped: function (nextProps, nextState) { },
            componentWillUpdate: function (nextProps, nextState) {
                this.componentWillUpdateWrapped(Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(nextProps), Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(nextState));
            },
            componentDidMount: function () { },
            /**
             * Props and State are not used by all components and so it is valid for either or both of the nextProps and nextState references passed up here to be null
             *
             * @instance
             * @protected
             * @this Bridge.React.Component$2
             * @memberof Bridge.React.Component$2
             * @param   {TProps}    previousProps    
             * @param   {TState}    previousState
             * @return  {void}
             */
            componentDidUpdateWrapped: function (previousProps, previousState) { },
            componentDidUpdate: function (previousProps, previousState) {
                this.componentDidUpdateWrapped(Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(previousProps), Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(previousState));
            },
            componentWillUnmount: function () { },
            /**
             * This replaces the entire state for the component instance - it does not merge any state data with any state data already present on the instance. As such, it might
             be best to consider this implementation to be more like ReplaceState.
             *
             * @instance
             * @protected
             * @this Bridge.React.Component$2
             * @memberof Bridge.React.Component$2
             * @param   {TState}    state
             * @return  {void}
             */
            setWrappedState: function (state) {
                this.setState({ value: state });
            },
            /**
             * This replaces the entire state for the component instance, and executes the callback delegate when the state has been
             successfully mutated. See http://stackoverflow.com/questions/30782948/why-calling-react-setstate-method-doesnt-mutate-the-state-immediately
             *
             * @instance
             * @protected
             * @this Bridge.React.Component$2
             * @memberof Bridge.React.Component$2
             * @param   {TState}           state       
             * @param   {System.Action}    callback
             * @return  {void}
             */
            setWrappedStateCallback: function (state, callback) {
                this.setState({ value: state }, callback);
            },
            /**
             * This replaces the entire state for the component instance. The updater function will be called with the previous state including any changes
             already queued up by previous calls to SetState, and the current up-to-date props.
             *
             * @instance
             * @protected
             * @this Bridge.React.Component$2
             * @memberof Bridge.React.Component$2
             * @param   {System.Func}    updater
             * @return  {void}
             */
            setWrappedStateUsingUpdater: function (updater) {
                var wrappedUpdater = function (prevState, props) {
                    var unwrappedPrevState = Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(prevState);
                    var unwrappedProps = Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(props);

                    return { value: updater(unwrappedPrevState, unwrappedProps) };
                };
                this.setState(wrappedUpdater);
            },
            /**
             * This replaces the entire state for the component instance, and executes the callback delegate when the state has been successfully mutated.
             The updater function will be called with the previous state including any changes already queued up by previous calls to SetState, and the
             current up-to-date props.
             *
             * @instance
             * @protected
             * @this Bridge.React.Component$2
             * @memberof Bridge.React.Component$2
             * @param   {System.Func}      updater     
             * @param   {System.Action}    callback
             * @return  {void}
             */
            setWrappedStateCallbackUsingUpdater: function (updater, callback) {
                var wrappedUpdater = function (prevState, props) {
                    var unwrappedPrevState = Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(prevState);
                    var unwrappedProps = Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(props);

                    return { value: updater(unwrappedPrevState, unwrappedProps) };
                };
                this.setState(wrappedUpdater, callback);
            },
            /**
             * This replaces the entire state for the component instance asynchronously. Execution will continue when the state has been successfully mutated.
             *
             * @instance
             * @protected
             * @this Bridge.React.Component$2
             * @memberof Bridge.React.Component$2
             * @param   {TState}                         state
             * @return  {System.Threading.Tasks.Task}
             */
            setWrappedStateAsync: function (state) {
                var tcs = new System.Threading.Tasks.TaskCompletionSource();
                this.setWrappedStateCallback(state, function () {
                    tcs.setResult(null);
                });
                return tcs.task;
            },
            /**
             * This replaces the entire state for the component instance, and returns a Task that will complete when the state has been successfully mutated.
             The updater function will be called with the previous state including any changes already queued up by previous calls to SetState, and the
             current up-to-date props.
             *
             * @instance
             * @protected
             * @this Bridge.React.Component$2
             * @memberof Bridge.React.Component$2
             * @param   {System.Func}                    updater
             * @return  {System.Threading.Tasks.Task}
             */
            setWrappedStateAsyncUsingUpdater: function (updater) {
                var tcs = new System.Threading.Tasks.TaskCompletionSource();
                this.setWrappedStateCallbackUsingUpdater(updater, function () {
                    tcs.setResult(null);
                });
                return tcs.task;
            }
        }
    }; });

    Bridge.define("Bridge.React.ComponentNameHelpers", {
        statics: {
            methods: {
                getDisplayName: function (source) {
                    if (source == null) {
                        throw new System.ArgumentNullException.$ctor1("source");
                    }

                    if (Bridge.isPlainObject(source)) {
                        return "Component";
                    }

                    return System.Linq.Enumerable.from(System.String.split(Bridge.Reflection.getTypeName(Bridge.getType(source)), [46, 91, 36, 96].map(function (i) {{ return String.fromCharCode(i); }}))).first();
                }
            }
        }
    });

    /**
     * React internals do some monkeying about with props references that will cause problems if the props reference is a Bridge class which does not have
     the [ObjectLiteral] attribute on it. The way that the Component and StatelessComponent classes work around this is to wrap props reference in an
     object literal since React's meddling is not recursive, it doesn't change any property values on props, it just changes how those top-level
     properties are described. This class provides a standard way to wrap the props data. It also performs some magic to extract any "Key"
     value from the props, since this must not be tucked away one level deeper as it is a magic React property (for more information
     about keyed elements, see https://facebook.github.io/react/docs/multiple-components.html#dynamic-children).
     *
     * @static
     * @abstract
     * @class Bridge.React.ComponentPropsHelpers
     */
    Bridge.define("Bridge.React.ComponentPropsHelpers", {
        statics: {
            fields: {
                /**
                 * Enabling this option allows for an optimisation in DoPropsReferencesMatch for comparing static anonymous functions that will work for projects that are entirely built
                 upon compiled-from-Bridge.NET C# but that may incorrectly find functions to be equivalent when they shouldn't (if the functions have been bound to different targets
                 using JS .bind). As such, this defaults to false and is exposed here only to allow unit tests to try the code out (this class is internal and so not for access by
                 consumers of the Bridge.React package).
                 *
                 * @static
                 * @public
                 * @memberof Bridge.React.ComponentPropsHelpers
                 * @default false
                 * @type boolean
                 */
                optimiseFunctionComparisonsBasedOnSolutionBeingPureBridge: false
            },
            ctors: {
                init: function () {
                    this.optimiseFunctionComparisonsBasedOnSolutionBeingPureBridge = false;
                }
            },
            methods: {
                wrapProps: function (propsIfAny) {
                    // Try to extract a Key value from the props - it might be a simple "key" value or it might be a property with a "getKey" function or it
                    // might be absent altogether
                    var keyIfAny = null;
                    var refIfAny = null;
                    if (propsIfAny != null) {
                        // Pre-16, Bridge used to default to camel-casing property names and so a "Key" property would be named "key" and it would have a getter method
                        // specified for it (it was possible to override these behaviours using PreserveMemberCase and [Name], [Template] or [FieldProperty] attributes)
                        // but 16 has changed things such that the name casing is not changed (by default - this may also be altered using the "conventions" options)
                        // and so we can't presume that a "Key" property will result in a JavaScript "key" property (or a "getKey" method).
                        
					if (propsIfAny.key || (propsIfAny.key === 0)) { // Ensure that a zero key is not considered "no-key-defined"
						keyIfAny = propsIfAny.key;
					}
					else if (propsIfAny.Key || (propsIfAny.Key === 0)) { // Ensure that a zero key is not considered "no-key-defined"
						keyIfAny = propsIfAny.Key;
					}
					else if (propsIfAny.getKey && (typeof(propsIfAny.getKey) == "function")) {
						var keyIfAnyFromPropertyGetter = propsIfAny.getKey();
						if (keyIfAnyFromPropertyGetter || (keyIfAnyFromPropertyGetter === 0)) { // Ensure that a zero key is not considered "no-key-defined"
							keyIfAny = keyIfAnyFromPropertyGetter;
						}
						else {
							keyIfAny = undefined;
						}
					}
					else {
						keyIfAny = undefined;
					}

					if (typeof(propsIfAny.ref) === "function") {
						refIfAny = propsIfAny.ref;
					}
					else if (typeof(propsIfAny.Ref) === "function") {
						refIfAny = propsIfAny.Ref;
					}
					else if (typeof(propsIfAny.getRef) === "function") {
						var refIfAnyFromPropertyGetter = propsIfAny.getRef();
						if (typeof(refIfAnyFromPropertyGetter) === "function") {
							refIfAny = refIfAnyFromPropertyGetter;
						}
						else {
							refIfAny = undefined;
						}
					}
					else {
						refIfAny = undefined;
					}
				;
                    }

                    // With the changes in React 15.0.0 (vs 0.14.7), a null Key value will be interpreted AS a key (and will either be ".$null" or ".$undefined")
                    // when really we want a null Key to mean NO KEY. Possibly related to https://github.com/facebook/react/issues/2386, but I would have expected
                    // to have seen this issue in 0.14 if it was that. The workaround is to return a type of "wrapped props" that doesn't even have a Key property
                    // on it if there is no key value to use.
                    var wrappedProps = { value: propsIfAny };
                    if ((typeof(keyIfAny) !== 'undefined')) {
                        wrappedProps.key = keyIfAny;
                    }
                    if ((typeof(refIfAny) !== 'undefined')) {
                        wrappedProps.ref = refIfAny;
                    }
                    return wrappedProps;
                },
                unWrapValueIfDefined: function (wrappedValueIfAny) {
                    return wrappedValueIfAny ? wrappedValueIfAny.value : null;
                },
                doPropsReferencesMatch: function (props1, props2) {
                    if ((props1 == null) && (props2 == null)) {
                        return true;
                    } else {
                        if ((props1 == null) || (props2 == null)) {
                            return false;
                        }
                    }

                    // Cast to object before calling GetType since we're using [IgnoreGeneric] (Bridge 15.7.0 bug workaround) - see http://forums.bridge.net/forum/bridge-net-pro/bugs/3343
                    if (!Bridge.referenceEquals(Bridge.getType(props1), Bridge.getType(props2))) {
                        return false;
                    }

                    // Bridge adds various private members that we don't want to consider so we want to try to guess whether we're a Bridge class and then ignore them. Basic classes
                    // have $$name and $$fullname properties, which seem pretty specific. However, [ObjectLiteral] types may have $literal or $getType properties, which identify them
                    // as "special" object literals. Other [ObjectLiteral] types may have no additional properties - which is good because we can skip any additional magic.
                    var optimiseFunctionComparisonsBasedOnSolutionBeingPureBridge = Bridge.React.ComponentPropsHelpers.optimiseFunctionComparisonsBasedOnSolutionBeingPureBridge;
                    			var isBridgeType = (!!props1.$$name && !!props1.$$fullname) || (typeof(props1.$getType) === "function") || (typeof(props1.$literal) === "boolean");
                    			for (var propName in props1) {
                    				if (isBridgeType && (propName.substr(0, 1) === "$")) {
                    					continue;
                    				}
                    				var propValue1 = props1[propName];
                    				var propValue2 = props2[propName];
                    				if ((propValue1 === propValue2) 
                    				|| ((propValue1 === null) && (propValue2 === null))
                    				|| ((typeof(propValue1) === "undefined") && (typeof(propValue2) === "undefined"))) {
                    					// Very simple cases where the properties match
                    					continue;
                    				}
                    				else if ((propValue1 === null) || (propValue2 === null) || (typeof(propValue1) === "undefined") || (typeof(propValue2) === "undefined")) {
                    					// Simple cases where one or both of the values are some sort of no-value (but either one of them has a value or they're inconsistent types of no-value,
                    					// since we'd have caught them above otherwise)
                    					return false;
                    				}
                    				else if ((typeof(propValue1) === "function") && (typeof(propValue2) === "function")) {
                    					// If they're Bridge-bound functions (which is what the presence of $scope and $method properties indicates), then check whether the underlying $method
                    					// and $scope references match (if they do then this means that it's the same method bound to the same "this" scope, but the actual function references
                    					// are not the same since they were the results from two different calls to Bridge.fn.bind)
                    					if (propValue1.$scope && propValue1.$method && propValue2.$scope && propValue2.$method && (propValue1.$scope === propValue2.$scope)) {
                    						if (propValue1.$method === propValue2.$method) {
                    							continue;
                    						}
                    						if (propValue1.$method.toString() === propValue2.$method.toString()) {
                    							// If the bound method is a named function then we can use the cheap reference equality comparison above. This is the ideal case, not only because
                    							// the comparison is so cheap but also because it means that the function is only declared once. Anonymous functions can't be compared by reference
                    							// and they have a cost (in terms of creation and in terms of additional GC work) that makes them less desirable. However, if the underlying bound
                    							// functions are anonymous functions then so long as they have the same content then they may be considered equivalent (since we've already checked
                    							// the references that they're bound to are the same, above).
                    							continue;
                    						}
                    					}
                    					else if (optimiseFunctionComparisonsBasedOnSolutionBeingPureBridge && isBridgeType && (propValue1.toString() === propValue2.toString())) {
                    						// This proposition makes me very nervious - if the functions were created by passing another function through .bind or .apply then they could have
                    						// different targets and it will not be sufficient to just check their string values. If the code in question is 100% compiled-via-Bridge then this
                    						// shouldn't happen (because Bridge uses its own binding logic) so one option is to try to guess whether the props type is a Bridge class and then
                    						// only consider this route if so, on the basis that Bridge code written to integrate with vanilla JavaScript is more likely to use plain objects.
                    						// However, this is still a leap of faith and it's entirely possible that Bridge-written library code intended for JavaScript would expose object
                    						// initialisation methods to make the JavaScript cleaner than including direct Bridge-class constructor calls. For now, I'll leave this in but
                    						// behind a turned-off flag until I convince myself that it's safe (or should be removed entirely).
                    						return true;
                    					}
                    				}
                    				else if ((typeof(propValue1.equals) === "function") && (propValue1.equals(propValue2) === true)) {
                    					// If propValue1 has an "equals" implementation then give that a go
                    					continue;
                    				}
                    				return false;
                    			}
                    			
                    return true;
                }
            }
        }
    });

    Bridge.define("Bridge.React.DispatcherMessage", {
        props: {
            source: 0,
            /**
             * This will never be null
             *
             * @instance
             * @public
             * @memberof Bridge.React.DispatcherMessage
             * @function action
             * @type Bridge.React.IDispatcherAction
             */
            action: null
        },
        ctors: {
            ctor: function (source, action) {
                this.$initialize();
                if ((source !== Bridge.React.MessageSourceOptions.server) && (source !== Bridge.React.MessageSourceOptions.view)) {
                    throw new System.ArgumentOutOfRangeException.$ctor1("source");
                }
                if (action == null) {
                    throw new System.ArgumentNullException.$ctor1("action");
                }

                this.source = source;
                this.action = action;
            }
        }
    });

    Bridge.define("Bridge.React.DispatcherMessageExtensions", {
        statics: {
            methods: {
                /**
                 * This will execute the specified callback with a non-null reference if the current DispatcherMessage action matches type T.
                 It will never call the work action with a null reference and it will never return a null reference. It will throw an exception
                 for a null DispatcherMessage or null work reference.
                 *
                 * @static
                 * @public
                 * @this Bridge.React.DispatcherMessageExtensions
                 * @memberof Bridge.React.DispatcherMessageExtensions
                 * @param   {Function}                                                             T          
                 * @param   {Bridge.React.DispatcherMessage}                                       message    
                 * @param   {System.Action}                                                        work
                 * @return  {Bridge.React.DispatcherMessageExtensions.IMatchDispatcherMessages}
                 */
                if: function (T, message, work) {
                    return new Bridge.React.DispatcherMessageExtensions.DispatcherMessageMatcher(message).else(T, work);
                },
                /**
                 * This will execute the specified callback with a non-null reference if the current DispatcherMessage action matches type T and
                 if that instance of T meets the specified conditions. It will never call the work action with a null reference and it will never
                 return a null reference. It will throw an exception for a null DispatcherMessage, null condition or null work reference.
                 *
                 * @static
                 * @public
                 * @this Bridge.React.DispatcherMessageExtensions
                 * @memberof Bridge.React.DispatcherMessageExtensions
                 * @param   {Function}                                                             T            
                 * @param   {Bridge.React.DispatcherMessage}                                       message      
                 * @param   {System.Func}                                                          condition    
                 * @param   {System.Action}                                                        work
                 * @return  {Bridge.React.DispatcherMessageExtensions.IMatchDispatcherMessages}
                 */
                if$1: function (T, message, condition, work) {
                    return new Bridge.React.DispatcherMessageExtensions.DispatcherMessageMatcher(message).else$1(T, condition, work);
                }
            }
        }
    });

    Bridge.define("Bridge.React.DispatcherMessageExtensions.IMatchDispatcherMessages", {
        $kind: "nested interface"
    });

    Bridge.define("Bridge.React.DispatchToken");

    Bridge.define("Bridge.React", {
        statics: {
            methods: {
                fixAttr: function (attributes) {
                    			if (!attributes || !attributes.hasOwnProperty("data"))
                    				return attributes;
                    			
                    			var data = attributes["data"];
                    			delete attributes["data"];
                    			for (var name in data) {
                    				if (!data.hasOwnProperty(name)) {
                    					continue;
                    				}
                    				attributes["data-" + name.replace('_', '-')] = data[name];
                    			}
                    			
                    return attributes;
                },
                /**
                 * This should only be used by the React.DOM factory method overloads - as such, I haven't created separate strongly-typed method signatures for StatelessComponent and PureComponent,
                 I've rolled them together by having a single signature that takes an object set. This means that this method could feasibly be called with an object of references without the
                 private "_reactElement" property, but no-one should be able to call this anyway so that's very low risk. Note that this won't work with the Component base class, it causes
                 React to throw a "Maximum call stack size exceeded" error that I haven't been able to get to the bottom of yet (the ToChildComponentArray extension methods only supported
                 StatelessComponent and PureComponent, so I'm ok for now with only supporting DOM factory methods that handle dynamic sets of StatelessComponent and PureComponent but
                 not Component)
                 *
                 * @static
                 * @this Bridge.React
                 * @memberof Bridge.React
                 * @param   {System.Collections.Generic.IEnumerable$1}    components
                 * @return  {Array.<Object>}
                 */
                toReactElementArray: function (components) {
                    if (components == null) {
                        throw new System.ArgumentNullException.$ctor1("components");
                    }

                    var componentsArray = System.Linq.Enumerable.from(components).ToArray();
                    var reactElements = System.Array.init(componentsArray.length, null, Object);
                    			for (var i = 0; i < componentsArray.length; i++) {
                    				reactElements[i] = (componentsArray[i] == null) ? null : componentsArray[i]._reactElement;
                    			}
                    			 
                    return reactElements;
                }
            }
        }
    });

    Bridge.define("Bridge.React.EnumerableComponentExtensions", {
        statics: {
            methods: {
                /**
                 * When initialising a component that will accept a set of child components, each child components must be of type Any&lt;ReactElement, string&gt; - if you have an enumerable
                 set of ReactElements then calling ToArray will not return an array of the appropriate type, so either each entry must be cast to an Any&lt;ReactElement, string&gt; before
                 calling ToArray or this helper function may be used.
                 *
                 * @static
                 * @public
                 * @this Bridge.React.EnumerableComponentExtensions
                 * @memberof Bridge.React.EnumerableComponentExtensions
                 * @param   {System.Collections.Generic.IEnumerable$1}    elements
                 * @return  {Array.<System.Object>}
                 */
                toChildComponentArray: function (elements) {
                    if (elements == null) {
                        throw new System.ArgumentNullException.$ctor1("elements");
                    }

                    return System.Linq.Enumerable.from(elements).select($asm.$.Bridge.React.EnumerableComponentExtensions.f1).ToArray(System.Object);
                },
                /**
                 * When initialising a component that will accept a set of child components, each child components must be of type Any&lt;ReactElement, string&gt; - if you have an enumerable
                 set of PureComponents of the same type then this helper function may be called to produce an array of the correct type (otherwise, each entry must be cast to an
                 Any&lt;ReactElement, string&gt; before ToArray is called on that set)
                 *
                 * @static
                 * @public
                 * @this Bridge.React.EnumerableComponentExtensions
                 * @memberof Bridge.React.EnumerableComponentExtensions
                 * @param   {Function}                                    TProps        
                 * @param   {System.Collections.Generic.IEnumerable$1}    components
                 * @return  {Array.<System.Object>}
                 */
                toChildComponentArray$1: function (TProps, components) {
                    if (components == null) {
                        throw new System.ArgumentNullException.$ctor1("components");
                    }

                    return System.Linq.Enumerable.from(components).select(function (component) {
                            return Bridge.React.PureComponent$1(TProps).op_Implicit$1(component);
                        }).ToArray(System.Object);
                },
                /**
                 * When initialising a component that will accept a set of child components, each child components must be of type Any&lt;ReactElement, string&gt; - if you have an enumerable
                 set of PureComponents of the same type then this helper function may be called to produce an array of the correct type (otherwise, each entry must be cast to an
                 Any&lt;ReactElement, string&gt; before ToArray is called on that set)
                 *
                 * @static
                 * @public
                 * @this Bridge.React.EnumerableComponentExtensions
                 * @memberof Bridge.React.EnumerableComponentExtensions
                 * @param   {Function}                                    TProps        
                 * @param   {System.Collections.Generic.IEnumerable$1}    components
                 * @return  {Array.<System.Object>}
                 */
                toChildComponentArray$2: function (TProps, components) {
                    if (components == null) {
                        throw new System.ArgumentNullException.$ctor1("components");
                    }

                    return System.Linq.Enumerable.from(components).select(function (component) {
                            return Bridge.React.StatelessComponent$1(TProps).op_Implicit$1(component);
                        }).ToArray(System.Object);
                }
            }
        }
    });

    Bridge.ns("Bridge.React.EnumerableComponentExtensions", $asm.$);

    Bridge.apply($asm.$.Bridge.React.EnumerableComponentExtensions, {
        f1: function (component) {
            return component;
        }
    });

    Bridge.define("Bridge.React.IDispatcherAction", {
        $kind: "interface"
    });

    Bridge.define("Bridge.React.IDispatcherActionExtensions", {
        statics: {
            methods: {
                /**
                 * This will execute the specified callback with a non-null reference if the current IDispatcherAction matches type T.
                 It will never call the work action with a null reference and it will never return a null reference. It will throw an exception
                 for a null IDispatcherAction or null work reference.
                 *
                 * @static
                 * @public
                 * @this Bridge.React.IDispatcherActionExtensions
                 * @memberof Bridge.React.IDispatcherActionExtensions
                 * @param   {Function}                                                            T         
                 * @param   {Bridge.React.IDispatcherAction}                                      action    
                 * @param   {System.Action}                                                       work
                 * @return  {Bridge.React.IDispatcherActionExtensions.IMatchDispatcherActions}
                 */
                if: function (T, action, work) {
                    return new Bridge.React.IDispatcherActionExtensions.DispatcherActionMatcher(action).else(T, work);
                },
                /**
                 * This will execute the specified callback with a non-null reference if the current IDispatcherAction matches type T and
                 if that instance of T meets the specified conditions. It will never call the work action with a null reference and it will never 
                 return a null reference. It will throw an exception for a null IDispatcherAction, null condition or null work reference.
                 *
                 * @static
                 * @public
                 * @this Bridge.React.IDispatcherActionExtensions
                 * @memberof Bridge.React.IDispatcherActionExtensions
                 * @param   {Function}                                                            T            
                 * @param   {Bridge.React.IDispatcherAction}                                      action       
                 * @param   {System.Func}                                                         condition    
                 * @param   {System.Action}                                                       work
                 * @return  {Bridge.React.IDispatcherActionExtensions.IMatchDispatcherActions}
                 */
                if$2: function (T, action, condition, work) {
                    return new Bridge.React.IDispatcherActionExtensions.DispatcherActionMatcher(action).else$2(T, condition, work);
                },
                /**
                 * This method signature combines the condition and the work into a single delegate - if it returns ActionMatchOptions.Handled then the
                 action will be considered matched and no subsequent Else methods will be considered but if it returns ActionMatchOptions.Ignored then
                 it will be considered unmatched. The callback will not be called if the current action does not match type T and it will never be called
                 with a null reference. It will throw an exception for a null IDispatcherAction, null condition or null work reference.
                 *
                 * @static
                 * @public
                 * @this Bridge.React.IDispatcherActionExtensions
                 * @memberof Bridge.React.IDispatcherActionExtensions
                 * @param   {Function}                                                            T         
                 * @param   {Bridge.React.IDispatcherAction}                                      action    
                 * @param   {System.Func}                                                         work
                 * @return  {Bridge.React.IDispatcherActionExtensions.IMatchDispatcherActions}
                 */
                if$1: function (T, action, work) {
                    return new Bridge.React.IDispatcherActionExtensions.DispatcherActionMatcher(action).else$1(T, work);
                }
            }
        }
    });

    Bridge.define("Bridge.React.IDispatcherActionExtensions.IMatchDispatcherActions", {
        $kind: "nested interface"
    });

    Bridge.define("Bridge.React.KeyboardEvent");

    /**
     * A collection of named {@link } attribute values.
     These are all based on the W3C UI Events Specification, with the key values listed in https://www.w3.org/TR/uievents-key/.
     *
     * @static
     * @abstract
     * @public
     * @class Bridge.React.KeyboardEvent.NamedKeys
     */
    Bridge.define("Bridge.React.KeyboardEvent.NamedKeys", {
        $kind: "nested class",
        statics: {
            fields: {
                unidentified: null,
                alt: null,
                altGraph: null,
                capsLock: null,
                control: null,
                fn: null,
                fnLock: null,
                meta: null,
                numLock: null,
                scrollLock: null,
                shift: null,
                symbol: null,
                symbolLock: null,
                hyper: null,
                super: null,
                enter: null,
                tab: null,
                arrowDown: null,
                arrowLeft: null,
                arrowRight: null,
                arrowUp: null,
                end: null,
                home: null,
                pageDown: null,
                pageUp: null,
                backspace: null,
                clear: null,
                copy: null,
                crSel: null,
                cut: null,
                delete: null,
                eraseEof: null,
                exSel: null,
                insert: null,
                paste: null,
                redo: null,
                undo: null,
                accept: null,
                again: null,
                attn: null,
                cancel: null,
                contextMenu: null,
                escape: null,
                execute: null,
                find: null,
                help: null,
                pause: null,
                play: null,
                props: null,
                select: null,
                zoomIn: null,
                zoomOut: null,
                brightnessDown: null,
                brightnessUp: null,
                eject: null,
                logOff: null,
                power: null,
                powerOff: null,
                printScreen: null,
                hibernate: null,
                standby: null,
                wakeUp: null,
                allCandidates: null,
                alphanumeric: null,
                codeInput: null,
                compose: null,
                convert: null,
                dead: null,
                finalMode: null,
                groupFirst: null,
                groupLast: null,
                groupNext: null,
                groupPrevious: null,
                modeChange: null,
                nextCandidate: null,
                nonConvert: null,
                previousCandidate: null,
                process: null,
                singleCandidate: null,
                hangulMode: null,
                hanjaMode: null,
                junjaMode: null,
                eisu: null,
                hankaku: null,
                hiragana: null,
                hiraganaKatakana: null,
                kanaMode: null,
                kanjiMode: null,
                katakana: null,
                romaji: null,
                zenkaku: null,
                zenkakuHankaku: null,
                f1: null,
                f2: null,
                f3: null,
                f4: null,
                f5: null,
                f6: null,
                f7: null,
                f8: null,
                f9: null,
                f10: null,
                f11: null,
                f12: null,
                soft1: null,
                soft2: null,
                soft3: null,
                soft4: null,
                channelDown: null,
                channelUp: null,
                close: null,
                mailForward: null,
                mailReply: null,
                mailSend: null,
                mediaClose: null,
                mediaFastForward: null,
                mediaPause: null,
                mediaPlay: null,
                mediaPlayPause: null,
                mediaRecord: null,
                mediaRewind: null,
                mediaStop: null,
                mediaTrackNext: null,
                mediaTrackPrevious: null,
                new: null,
                open: null,
                print: null,
                save: null,
                spellCheck: null,
                key11: null,
                key12: null,
                audioBalanceLeft: null,
                audioBalanceRight: null,
                audioBassBoostDown: null,
                audioBassBoostToggle: null,
                audioBassBoostUp: null,
                audioFaderFront: null,
                audioFaderRear: null,
                audioSurroundModeNext: null,
                audioTrebleDown: null,
                audioTrebleUp: null,
                audioVolumeDown: null,
                audioVolumeUp: null,
                audioVolumeMute: null,
                microphoneToggle: null,
                microphoneVolumeDown: null,
                microphoneVolumeUp: null,
                microphoneVolumeMute: null,
                speechCorrectionList: null,
                speechInputToggle: null,
                launchApplication1: null,
                launchApplication2: null,
                launchCalendar: null,
                launchContacts: null,
                launchMail: null,
                launchMediaPlayer: null,
                launchMusicPlayer: null,
                launchPhone: null,
                launchScreenSaver: null,
                launchSpreadsheet: null,
                launchWebBrowser: null,
                launchWebCam: null,
                launchWordProcessor: null,
                browserBack: null,
                browserFavorites: null,
                browserForward: null,
                browserHome: null,
                browserRefresh: null,
                browserSearch: null,
                browserStop: null,
                appSwitch: null,
                call: null,
                camera: null,
                cameraFocus: null,
                endCall: null,
                goBack: null,
                goHome: null,
                headsetHook: null,
                lastNumberRedial: null,
                notification: null,
                mannerMode: null,
                voiceDial: null,
                TV: null,
                tV3DMode: null,
                tVAntennaCable: null,
                tVAudioDescription: null,
                tVAudioDescriptionMixDown: null,
                tVAudioDescriptionMixUp: null,
                tVContentsMenu: null,
                tVDataService: null,
                tVInput: null,
                tVInputComponent1: null,
                tVInputComponent2: null,
                tVInputComposite1: null,
                tVInputComposite2: null,
                tVInputHDMI1: null,
                tVInputHDMI2: null,
                tVInputHDMI3: null,
                tVInputHDMI4: null,
                tVInputVGA1: null,
                tVMediaContext: null,
                tVNetwork: null,
                tVNumberEntry: null,
                tVPower: null,
                tVRadioService: null,
                tVSatellite: null,
                tVSatelliteBS: null,
                tVSatelliteCS: null,
                tVSatelliteToggle: null,
                tVTerrestrialAnalog: null,
                tVTerrestrialDigital: null,
                tVTimer: null,
                aVRInput: null,
                aVRPower: null,
                colorF0Red: null,
                colorF1Green: null,
                colorF2Yellow: null,
                colorF3Blue: null,
                colorF4Grey: null,
                colorF5Brown: null,
                closedCaptionToggle: null,
                dimmer: null,
                displaySwap: null,
                DVR: null,
                exit: null,
                favoriteClear0: null,
                favoriteClear1: null,
                favoriteClear2: null,
                favoriteClear3: null,
                favoriteRecall0: null,
                favoriteRecall1: null,
                favoriteRecall2: null,
                favoriteRecall3: null,
                favoriteStore0: null,
                favoriteStore1: null,
                favoriteStore2: null,
                favoriteStore3: null,
                guide: null,
                guideNextDay: null,
                guidePreviousDay: null,
                info: null,
                instantReplay: null,
                link: null,
                listProgram: null,
                liveContent: null,
                lock: null,
                mediaApps: null,
                mediaAudioTrack: null,
                mediaLast: null,
                mediaSkipBackward: null,
                mediaSkipForward: null,
                mediaStepBackward: null,
                mediaStepForward: null,
                mediaTopMenu: null,
                navigateIn: null,
                navigateNext: null,
                navigateOut: null,
                navigatePrevious: null,
                nextFavoriteChannel: null,
                nextUserProfile: null,
                onDemand: null,
                pairing: null,
                pinPDown: null,
                pinPMove: null,
                pinPToggle: null,
                pinPUp: null,
                playSpeedDown: null,
                playSpeedReset: null,
                playSpeedUp: null,
                randomToggle: null,
                rcLowBattery: null,
                recordSpeedNext: null,
                rfBypass: null,
                scanChannelsToggle: null,
                screenModeNext: null,
                settings: null,
                splitScreenToggle: null,
                sTBInput: null,
                sTBPower: null,
                subtitle: null,
                teletext: null,
                videoModeNext: null,
                wink: null,
                zoomToggle: null
            },
            ctors: {
                init: function () {
                    this.unidentified = "Unidentified";
                    this.alt = "Alt";
                    this.altGraph = "AltGraph";
                    this.capsLock = "CapsLock";
                    this.control = "Control";
                    this.fn = "Fn";
                    this.fnLock = "FnLock";
                    this.meta = "Meta";
                    this.numLock = "NumLock";
                    this.scrollLock = "ScrollLock";
                    this.shift = "Shift";
                    this.symbol = "Symbol";
                    this.symbolLock = "SymbolLock";
                    this.hyper = "Hyper";
                    this.super = "Super";
                    this.enter = "Enter";
                    this.tab = "Tab";
                    this.arrowDown = "ArrowDown";
                    this.arrowLeft = "ArrowLeft";
                    this.arrowRight = "ArrowRight";
                    this.arrowUp = "ArrowUp";
                    this.end = "End";
                    this.home = "Home";
                    this.pageDown = "PageDown";
                    this.pageUp = "PageUp";
                    this.backspace = "Backspace";
                    this.clear = "Clear";
                    this.copy = "Copy";
                    this.crSel = "CrSel";
                    this.cut = "Cut";
                    this.delete = "Delete";
                    this.eraseEof = "EraseEof";
                    this.exSel = "ExSel";
                    this.insert = "Insert";
                    this.paste = "Paste";
                    this.redo = "Redo";
                    this.undo = "Undo";
                    this.accept = "Accept";
                    this.again = "Again";
                    this.attn = "Attn";
                    this.cancel = "Cancel";
                    this.contextMenu = "ContextMenu";
                    this.escape = "Escape";
                    this.execute = "Execute";
                    this.find = "Find";
                    this.help = "Help";
                    this.pause = "Pause";
                    this.play = "Play";
                    this.props = "Props";
                    this.select = "Select";
                    this.zoomIn = "ZoomIn";
                    this.zoomOut = "ZoomOut";
                    this.brightnessDown = "BrightnessDown";
                    this.brightnessUp = "BrightnessUp";
                    this.eject = "Eject";
                    this.logOff = "LogOff";
                    this.power = "Power";
                    this.powerOff = "PowerOff";
                    this.printScreen = "PrintScreen";
                    this.hibernate = "Hibernate";
                    this.standby = "Standby";
                    this.wakeUp = "WakeUp";
                    this.allCandidates = "AllCandidates";
                    this.alphanumeric = "Alphanumeric";
                    this.codeInput = "CodeInput";
                    this.compose = "Compose";
                    this.convert = "Convert";
                    this.dead = "Dead";
                    this.finalMode = "FinalMode";
                    this.groupFirst = "GroupFirst";
                    this.groupLast = "GroupLast";
                    this.groupNext = "GroupNext";
                    this.groupPrevious = "GroupPrevious";
                    this.modeChange = "ModeChange";
                    this.nextCandidate = "NextCandidate";
                    this.nonConvert = "NonConvert";
                    this.previousCandidate = "PreviousCandidate";
                    this.process = "Process";
                    this.singleCandidate = "SingleCandidate";
                    this.hangulMode = "HangulMode";
                    this.hanjaMode = "HanjaMode";
                    this.junjaMode = "JunjaMode";
                    this.eisu = "Eisu";
                    this.hankaku = "Hankaku";
                    this.hiragana = "Hiragana";
                    this.hiraganaKatakana = "HiraganaKatakana";
                    this.kanaMode = "KanaMode";
                    this.kanjiMode = "KanjiMode";
                    this.katakana = "Katakana";
                    this.romaji = "Romaji";
                    this.zenkaku = "Zenkaku";
                    this.zenkakuHankaku = "ZenkakuHankaku";
                    this.f1 = "F1";
                    this.f2 = "F2";
                    this.f3 = "F3";
                    this.f4 = "F4";
                    this.f5 = "F5";
                    this.f6 = "F6";
                    this.f7 = "F7";
                    this.f8 = "F8";
                    this.f9 = "F9";
                    this.f10 = "F10";
                    this.f11 = "F11";
                    this.f12 = "F12";
                    this.soft1 = "Soft1";
                    this.soft2 = "Soft2";
                    this.soft3 = "Soft3";
                    this.soft4 = "Soft4";
                    this.channelDown = "ChannelDown";
                    this.channelUp = "ChannelUp";
                    this.close = "Close";
                    this.mailForward = "MailForward";
                    this.mailReply = "MailReply";
                    this.mailSend = "MailSend";
                    this.mediaClose = "MediaClose";
                    this.mediaFastForward = "MediaFastForward";
                    this.mediaPause = "MediaPause";
                    this.mediaPlay = "MediaPlay";
                    this.mediaPlayPause = "MediaPlayPause";
                    this.mediaRecord = "MediaRecord";
                    this.mediaRewind = "MediaRewind";
                    this.mediaStop = "MediaStop";
                    this.mediaTrackNext = "MediaTrackNext";
                    this.mediaTrackPrevious = "MediaTrackPrevious";
                    this.new = "New";
                    this.open = "Open";
                    this.print = "Print";
                    this.save = "Save";
                    this.spellCheck = "SpellCheck";
                    this.key11 = "Key11";
                    this.key12 = "Key12";
                    this.audioBalanceLeft = "AudioBalanceLeft";
                    this.audioBalanceRight = "AudioBalanceRight";
                    this.audioBassBoostDown = "AudioBassBoostDown";
                    this.audioBassBoostToggle = "AudioBassBoostToggle";
                    this.audioBassBoostUp = "AudioBassBoostUp";
                    this.audioFaderFront = "AudioFaderFront";
                    this.audioFaderRear = "AudioFaderRear";
                    this.audioSurroundModeNext = "AudioSurroundModeNext";
                    this.audioTrebleDown = "AudioTrebleDown";
                    this.audioTrebleUp = "AudioTrebleUp";
                    this.audioVolumeDown = "AudioVolumeDown";
                    this.audioVolumeUp = "AudioVolumeUp";
                    this.audioVolumeMute = "AudioVolumeMute";
                    this.microphoneToggle = "MicrophoneToggle";
                    this.microphoneVolumeDown = "MicrophoneVolumeDown";
                    this.microphoneVolumeUp = "MicrophoneVolumeUp";
                    this.microphoneVolumeMute = "MicrophoneVolumeMute";
                    this.speechCorrectionList = "SpeechCorrectionList";
                    this.speechInputToggle = "SpeechInputToggle";
                    this.launchApplication1 = "LaunchApplication1";
                    this.launchApplication2 = "LaunchApplication2";
                    this.launchCalendar = "LaunchCalendar";
                    this.launchContacts = "LaunchContacts";
                    this.launchMail = "LaunchMail";
                    this.launchMediaPlayer = "LaunchMediaPlayer";
                    this.launchMusicPlayer = "LaunchMusicPlayer";
                    this.launchPhone = "LaunchPhone";
                    this.launchScreenSaver = "LaunchScreenSaver";
                    this.launchSpreadsheet = "LaunchSpreadsheet";
                    this.launchWebBrowser = "LaunchWebBrowser";
                    this.launchWebCam = "LaunchWebCam";
                    this.launchWordProcessor = "LaunchWordProcessor";
                    this.browserBack = "BrowserBack";
                    this.browserFavorites = "BrowserFavorites";
                    this.browserForward = "BrowserForward";
                    this.browserHome = "BrowserHome";
                    this.browserRefresh = "BrowserRefresh";
                    this.browserSearch = "BrowserSearch";
                    this.browserStop = "BrowserStop";
                    this.appSwitch = "AppSwitch";
                    this.call = "Call";
                    this.camera = "Camera";
                    this.cameraFocus = "CameraFocus";
                    this.endCall = "EndCall";
                    this.goBack = "GoBack";
                    this.goHome = "GoHome";
                    this.headsetHook = "HeadsetHook";
                    this.lastNumberRedial = "LastNumberRedial";
                    this.notification = "Notification";
                    this.mannerMode = "MannerMode";
                    this.voiceDial = "VoiceDial";
                    this.TV = "TV";
                    this.tV3DMode = "TV3DMode";
                    this.tVAntennaCable = "TVAntennaCable";
                    this.tVAudioDescription = "TVAudioDescription";
                    this.tVAudioDescriptionMixDown = "TVAudioDescriptionMixDown";
                    this.tVAudioDescriptionMixUp = "TVAudioDescriptionMixUp";
                    this.tVContentsMenu = "TVContentsMenu";
                    this.tVDataService = "TVDataService";
                    this.tVInput = "TVInput";
                    this.tVInputComponent1 = "TVInputComponent1";
                    this.tVInputComponent2 = "TVInputComponent2";
                    this.tVInputComposite1 = "TVInputComposite1";
                    this.tVInputComposite2 = "TVInputComposite2";
                    this.tVInputHDMI1 = "TVInputHDMI1";
                    this.tVInputHDMI2 = "TVInputHDMI2";
                    this.tVInputHDMI3 = "TVInputHDMI3";
                    this.tVInputHDMI4 = "TVInputHDMI4";
                    this.tVInputVGA1 = "TVInputVGA1";
                    this.tVMediaContext = "TVMediaContext";
                    this.tVNetwork = "TVNetwork";
                    this.tVNumberEntry = "TVNumberEntry";
                    this.tVPower = "TVPower";
                    this.tVRadioService = "TVRadioService";
                    this.tVSatellite = "TVSatellite";
                    this.tVSatelliteBS = "TVSatelliteBS";
                    this.tVSatelliteCS = "TVSatelliteCS";
                    this.tVSatelliteToggle = "TVSatelliteToggle";
                    this.tVTerrestrialAnalog = "TVTerrestrialAnalog";
                    this.tVTerrestrialDigital = "TVTerrestrialDigital";
                    this.tVTimer = "TVTimer";
                    this.aVRInput = "AVRInput";
                    this.aVRPower = "AVRPower";
                    this.colorF0Red = "ColorF0Red";
                    this.colorF1Green = "ColorF1Green";
                    this.colorF2Yellow = "ColorF2Yellow";
                    this.colorF3Blue = "ColorF3Blue";
                    this.colorF4Grey = "ColorF4Grey";
                    this.colorF5Brown = "ColorF5Brown";
                    this.closedCaptionToggle = "ClosedCaptionToggle";
                    this.dimmer = "Dimmer";
                    this.displaySwap = "DisplaySwap";
                    this.DVR = "DVR";
                    this.exit = "Exit";
                    this.favoriteClear0 = "FavoriteClear0";
                    this.favoriteClear1 = "FavoriteClear1";
                    this.favoriteClear2 = "FavoriteClear2";
                    this.favoriteClear3 = "FavoriteClear3";
                    this.favoriteRecall0 = "FavoriteRecall0";
                    this.favoriteRecall1 = "FavoriteRecall1";
                    this.favoriteRecall2 = "FavoriteRecall2";
                    this.favoriteRecall3 = "FavoriteRecall3";
                    this.favoriteStore0 = "FavoriteStore0";
                    this.favoriteStore1 = "FavoriteStore1";
                    this.favoriteStore2 = "FavoriteStore2";
                    this.favoriteStore3 = "FavoriteStore3";
                    this.guide = "Guide";
                    this.guideNextDay = "GuideNextDay";
                    this.guidePreviousDay = "GuidePreviousDay";
                    this.info = "Info";
                    this.instantReplay = "InstantReplay";
                    this.link = "Link";
                    this.listProgram = "ListProgram";
                    this.liveContent = "LiveContent";
                    this.lock = "Lock";
                    this.mediaApps = "MediaApps";
                    this.mediaAudioTrack = "MediaAudioTrack";
                    this.mediaLast = "MediaLast";
                    this.mediaSkipBackward = "MediaSkipBackward";
                    this.mediaSkipForward = "MediaSkipForward";
                    this.mediaStepBackward = "MediaStepBackward";
                    this.mediaStepForward = "MediaStepForward";
                    this.mediaTopMenu = "MediaTopMenu";
                    this.navigateIn = "NavigateIn";
                    this.navigateNext = "NavigateNext";
                    this.navigateOut = "NavigateOut";
                    this.navigatePrevious = "NavigatePrevious";
                    this.nextFavoriteChannel = "NextFavoriteChannel";
                    this.nextUserProfile = "NextUserProfile";
                    this.onDemand = "OnDemand";
                    this.pairing = "Pairing";
                    this.pinPDown = "PinPDown";
                    this.pinPMove = "PinPMove";
                    this.pinPToggle = "PinPToggle";
                    this.pinPUp = "PinPUp";
                    this.playSpeedDown = "PlaySpeedDown";
                    this.playSpeedReset = "PlaySpeedReset";
                    this.playSpeedUp = "PlaySpeedUp";
                    this.randomToggle = "RandomToggle";
                    this.rcLowBattery = "RcLowBattery";
                    this.recordSpeedNext = "RecordSpeedNext";
                    this.rfBypass = "RfBypass";
                    this.scanChannelsToggle = "ScanChannelsToggle";
                    this.screenModeNext = "ScreenModeNext";
                    this.settings = "Settings";
                    this.splitScreenToggle = "SplitScreenToggle";
                    this.sTBInput = "STBInput";
                    this.sTBPower = "STBPower";
                    this.subtitle = "Subtitle";
                    this.teletext = "Teletext";
                    this.videoModeNext = "VideoModeNext";
                    this.wink = "Wink";
                    this.zoomToggle = "ZoomToggle";
                }
            }
        }
    });

    Bridge.define("Bridge.React.MessageSourceOptions", {
        $kind: "enum",
        statics: {
            fields: {
                server: 0,
                view: 1
            }
        }
    });

    /**
     * When creating custom components that may be used as part of a list of dynamic children elements, it is important that each component instance be able to
     have a unique key provided to them. To try to make this as simple as possible, props classes for custom components may be derived from this class and the
     key passed in and maintained for access by React. The Key property itself is private since there is no need for the custom component to access the key -
     it is important only that the parent of the component be able to provide the component with a key and that React be able to retrieve that key.
     *
     * @abstract
     * @public
     * @class Bridge.React.PropsWithKey
     */
    Bridge.define("Bridge.React.PropsWithKey", {
        props: {
            key: null
        },
        ctors: {
            ctor: function (key) {
                this.$initialize();
                this.key = key;
            }
        }
    });

    /**
     * This provides a class that is like a combination of the StatelessComponent and the React "PureRenderMixin" - it has no State and will not update if given a new Props reference
     whose individual properties are the same as the previous Props reference. Only a shallow equality check is performed, with simple referential equality tests performed - this
     will be most reliable if immutable, persistent types are used for any nested data structures (as is the case with the PureRenderMixin). Using this base class means that there
     is often less work for the Virtual DOM to do, meaning that UI updates require less work / are faster / are more efficient (it also means it is not possible to provide a custom
     ShouldComponentUpdate implementation, since there is already an internal one required to make this work). As with the Component and StatelessComponent base classes (and due to
     C# supporting multiple constructor signatures - unlike JavaScript), the constructors will not be executed and so any logic or member initialisation in there will be ignored.
     *
     * @abstract
     * @public
     * @class Bridge.React.PureComponent$1
     */
    Bridge.define("Bridge.React.PureComponent$1", function (TProps) { return {
        statics: {
            fields: {
                _reactComponentClasses: null
            },
            ctors: {
                init: function () {
                    this._reactComponentClasses = new (System.Collections.Generic.Dictionary$2(Function,System.Object))();
                }
            },
            methods: {
                op_Implicit: function (component) {
                    // Since React 0.11 (see https://facebook.github.io/react/blog/2014/07/17/react-v0.11.html), it has been acceptable to return null from a Render method to
                    // indicate that nothing should be rendered. As such, it's possible that a null PureComponent reference will pass through this operator method and so null
                    // needs to be allowed (previously this would throw a ArgumentNullException for a null component).
                    if (component == null) {
                        return null;
                    }
                    return component._reactElement;
                },
                op_Implicit$1: function (component) {
                    // Since React 0.11 (see https://facebook.github.io/react/blog/2014/07/17/react-v0.11.html), it has been acceptable to return null from a Render method to
                    // indicate that nothing should be rendered. As such, it's possible that a null PureComponent reference will pass through this operator method and so null
                    // needs to be allowed (previously this would throw a ArgumentNullException for a null component).
                    if (component == null) {
                        return null;
                    }
                    return component._reactElement;
                }
            }
        },
        fields: {
            _reactElement: null
        },
        props: {
            /**
             * Props is not used by all components and so this may be null
             *
             * @instance
             * @protected
             * @readonly
             * @memberof Bridge.React.PureComponent$1
             * @function unwrappedProps
             * @type TProps
             */
            unwrappedProps: {
                get: function () {
                    return Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(this.props);
                }
            },
            /**
             * This will never be null nor contain any null references, though it may be empty if there are no children to render
             *
             * @instance
             * @protected
             * @readonly
             * @memberof Bridge.React.PureComponent$1
             * @function children
             * @type Array.<System.Object>
             */
            children: {
                get: function () {
                    // props and props.children are optional and so may not be defined - return an empty array in either case (so that the caller doesn't have to worry about
                    // will-this-Children-reference-be-null-or-not). Also, React sets props.children to  object if there is only a single child and to an array if there are
                    // multiple - this means that we need to check for the single-child case and wrap it in an array otherwise we'll be returning a non-array object from this
                    // method when the property type is an array (this addresses github.com/ProductiveRage/Bridge.React/issues/20).
                    return this.props && this.props.children ? (Array.isArray(this.props.children) ? this.props.children : [this.props.children]) : [];
                }
            }
        },
        ctors: {
            ctor: function (props, children) {
                if (children === void 0) { children = []; }

                this.$initialize();
                // To ensure that a single "template" (ie. React component) is created per unique class, a static "_reactComponentClasss" dictionary is maintained. If it has no entry
                // for the current type then this must be the first instantiation of that type and so a component class will be created and added to the dictionary, ready for re-use
                // by any subsequent component instances.
                var currentType = Bridge.getType(this); // Cast to object first in case derived class uses [IgnoreGeneric] - see http://forums.bridge.net/forum/bridge-net-pro/bugs/3343
                var reactComponentClass = { };
                if (!Bridge.React.PureComponent$1(TProps)._reactComponentClasses.tryGetValue(currentType, reactComponentClass)) {
                    reactComponentClass.v = Bridge.React.ReactComponentClassCreator.createClass(this, Bridge.React.PureComponent$1(TProps));
                    Bridge.React.PureComponent$1(TProps)._reactComponentClasses.set(currentType, reactComponentClass.v);
                }

                // Now that the React component class is certain to have been defined (once per unique C# component class), this instance requires a React element to be created
                // for it. The internal React mechanism means that the component's constructor will not be executed, which is why ALL configuration options for a component must
                // be contained within the props. Note: In most cases where children are specified as a params array, we don't want the "children require unique keys" warning
                // from React (you don't get it if you call DOM.Div(null, "Item1", "Item2"), so we don't want it in most cases here either - to achieve this, we prepare an
                // arguments array and pass that to React.createElement in an "apply" call.
                var createElementArgs = System.Array.init([reactComponentClass.v, Bridge.React.ComponentPropsHelpers.wrapProps(props)], System.Object);
                if (children != null) {
                    createElementArgs = createElementArgs.concat.apply(createElementArgs, children);
                }
                this._reactElement = React.createElement.apply(null, createElementArgs);
            }
        },
        methods: {
            componentWillMount: function () { },
            /**
             * Props is not used by all components and so it is valid for the nextProps reference passed up here to be null
             *
             * @instance
             * @protected
             * @this Bridge.React.PureComponent$1
             * @memberof Bridge.React.PureComponent$1
             * @param   {TProps}    nextProps
             * @return  {void}
             */
            componentWillReceivePropsWrapped: function (nextProps) { },
            componentWillReceiveProps: function (nextPropsIfAny) {
                this.componentWillReceivePropsWrapped(Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(nextPropsIfAny));
            },
            shouldComponentUpdate: function (nextPropsIfAny) {
                return !Bridge.React.ComponentPropsHelpers.doPropsReferencesMatch(this.unwrappedProps, Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(nextPropsIfAny));
            },
            /**
             * Props are not used by all components and so it is valid for the nextProps reference passed up here to be null
             *
             * @instance
             * @protected
             * @this Bridge.React.PureComponent$1
             * @memberof Bridge.React.PureComponent$1
             * @param   {TProps}    nextProps
             * @return  {void}
             */
            componentWillUpdateWrapped: function (nextProps) { },
            componentWillUpdate: function (nextProps) {
                this.componentWillUpdateWrapped(Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(nextProps));
            },
            componentDidMount: function () { },
            /**
             * This will be invoked immediately after the component's updates are flushed to the DOM (but not called for the initial render, ComponentDidMount is called then instead)
             *
             * @instance
             * @protected
             * @this Bridge.React.PureComponent$1
             * @memberof Bridge.React.PureComponent$1
             * @param   {TProps}    previousProps
             * @return  {void}
             */
            componentDidUpdateWrapped: function (previousProps) { },
            componentDidUpdate: function (previousProps) {
                this.componentDidUpdateWrapped(Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(previousProps));
            },
            componentWillUnmount: function () { }
        }
    }; });

    Bridge.define("Bridge.React.RawHtml", {
        props: {
            __html: null
        }
    });

    Bridge.define("Bridge.React.ReactComponentClassCreator", {
        statics: {
            methods: {
                createClass: function (template, baseComponent) {
                    if (template == null) {
                        throw new System.ArgumentNullException.$ctor1("template");
                    }
                    if (baseComponent == null) {
                        throw new System.ArgumentNullException.$ctor1("baseComponent");
                    }

                    var displayName = Bridge.React.ComponentNameHelpers.getDisplayName(template);
                    var reactComponentClass = null;
                    			function getOwnPropertyDescriptors(obj) { // IE11 doesn't support Object.getOwnPropertyDescriptors so use this
                    				var result = { };
                    				var arrPropertyNames = Object.getOwnPropertyNames(obj); // IE11 doesn't support "var key of Reflect.ownKeys(obj)" but this approach should suffice for Bridge classes
                    				for (var i = 0; i < arrPropertyNames.length; i++) {
                    					var key = arrPropertyNames[i];
                    					result[key] = Object.getOwnPropertyDescriptor(obj, key);
                    				}
                    				return result;
                    			}
                    			
                    			// Use the displayName to name the component class function (React DevTools will use this)
                    			eval("reactComponentClass = function " + displayName + "(props) { Bridge.React.ReactComponentClassCreator.initialiseComponentState(this, props); }");

                    			// Set the React.Component base class
                    			reactComponentClass.prototype = Object.create(
                    				React.Component && React.Component.prototype,
                    				{ constructor: { value: reactComponentClass, enumerable: false, writable: true, configurable: true } }
                    			);
                    			if (Object.setPrototypeOf) {
                    				Object.setPrototypeOf(reactComponentClass, React.Component);
                    			}
                    			else {
                    				reactComponentClass.__proto__ = React.Component;
                    			}

                    			// Attach the members
                    			// - Get all class prototypes until hit the component base class (there's no need to go down to System.Object)
                    			// - Apply the members in reverse order (in case any members are named on a derived class and a base class, the derived class should "win" - this won't break calling
                    			//   methods on the base due to the way that Bridge generates that code)
                    			var protoStack = [];
                    			var o = template.__proto__;
                    			while (o) {
                    				protoStack.push(o);
                    				if ((o.$$fullname || "") === baseComponent.$$fullname) {
                    					break;
                    				}
                    				o = o.__proto__;
                    			}
                    			for (var i = protoStack.length - 1; i >= 0; i--) {
                    				o = protoStack[i];
                    				var descriptors = getOwnPropertyDescriptors(o);
                    				for (var name in descriptors) {
                    					var descriptor = descriptors[name];
                    					Object.defineProperty(reactComponentClass.prototype, name, descriptor);
                    				}
                    			}
                    			
                    return reactComponentClass;
                },
                /**
                 * Class-based components don't support the "getInitialState" method as the state (if an initial value must be set) may be set in the constructor. These bindings don't
                 support constructors (because there are too many complications with constructor overloading, which JavaScript doesn't have to deal with) and so we need a way to tie
                 the two concepts together. To do this, if a stateful component has a getInitialState method (renamed in the JavaScript to "constructorStateInitialiser" in these
                 bindings) then it will be called from the component constructor and used to set the initial state value.
                 *
                 * @static
                 * @private
                 * @this Bridge.React.ReactComponentClassCreator
                 * @memberof Bridge.React.ReactComponentClassCreator
                 * @param   {System.Object}    instance    
                 * @param   {System.Object}    props
                 * @return  {void}
                 */
                initialiseComponentState: function (instance, props) {
                    // The props reference is passed to the constructor but won't yet have been applied to the instance - we'll need to do that in case the props need to be accessed
                    // from the GetInitialState method (it shouldn't matter that we're doing this early, React will do it itself shortly). Bridge classes require an $init property when
                    // the class has properties and/or fields, so we need to create one (any property that doesn't have a value in $init will have the default value for the property type).
                    				instance.$init = {};
                    				var getInitialState = instance.constructorStateInitialiser;
                    				if ((typeof(getInitialState) !== "function") || (getInitialState.length !== 0)) {
                    					return;
                    				}
                    				instance.props = props;
                    				var state = getInitialState.call(instance);
                    				if (state) {
                    					instance.state = { value: state };
                    				}
                    			
                }
            }
        }
    });

    /**
     * This is a helper class for constructing sets of ReactElement instances. It has a single Add method that has three overloads - one to take a single ReactElement,
     one to take an IEnumerable of ReactElement and one to take a params array of ReactElement. Since many React library methods allow null ReactElement references,
     null element references are allowed here (though null sets of elements are not).
     *
     * @public
     * @class Bridge.React.ReactElementList
     * @implements  System.Collections.Generic.IEnumerable$1
     */
    Bridge.define("Bridge.React.ReactElementList", {
        inherits: [System.Collections.Generic.IEnumerable$1(Object)],
        statics: {
            props: {
                empty: null
            },
            ctors: {
                init: function () {
                    this.empty = new Bridge.React.ReactElementList(System.Array.init(0, null, Object));
                }
            }
        },
        fields: {
            _items: null
        },
        alias: ["getEnumerator", ["System$Collections$Generic$IEnumerable$1$Object$GetEnumerator", "System$Collections$Generic$IEnumerable$1$GetEnumerator"]],
        ctors: {
            ctor: function (items) {
                this.$initialize();
                if (items == null) {
                    throw new System.ArgumentNullException.$ctor1("items");
                }

                this._items = items;
            }
        },
        methods: {
            /**
             * A null item reference is acceptable here
             *
             * @instance
             * @public
             * @this Bridge.React.ReactElementList
             * @memberof Bridge.React.ReactElementList
             * @param   {Object}                           item
             * @return  {Bridge.React.ReactElementList}
             */
            add: function (item) {
                return new Bridge.React.ReactElementList(System.Linq.Enumerable.from(this._items).concat(System.Array.init([item], Object)));
            },
            /**
             * The items set may contain null references but the set itself must not be null
             *
             * @instance
             * @public
             * @this Bridge.React.ReactElementList
             * @memberof Bridge.React.ReactElementList
             * @param   {System.Collections.Generic.IEnumerable$1}    items
             * @return  {Bridge.React.ReactElementList}
             */
            add$2: function (items) {
                if (items == null) {
                    throw new System.ArgumentNullException.$ctor1("items");
                }

                return new Bridge.React.ReactElementList(System.Linq.Enumerable.from(this._items).concat(items));
            },
            /**
             * The items params array may contain null references but the array itself must not be null
             *
             * @instance
             * @public
             * @this Bridge.React.ReactElementList
             * @memberof Bridge.React.ReactElementList
             * @param   {Array.<Object>}                   items
             * @return  {Bridge.React.ReactElementList}
             */
            add$1: function (items) {
                if (items === void 0) { items = []; }
                if (items == null) {
                    throw new System.ArgumentNullException.$ctor1("items");
                }

                return new Bridge.React.ReactElementList(System.Linq.Enumerable.from(this._items).concat(items));
            },
            /**
             * The items set may contain null references but the set itself must not be null
             *
             * @instance
             * @public
             * @this Bridge.React.ReactElementList
             * @memberof Bridge.React.ReactElementList
             * @param   {Function}                                    TProps    
             * @param   {System.Collections.Generic.IEnumerable$1}    items
             * @return  {Bridge.React.ReactElementList}
             */
            add$3: function (TProps, items) {
                if (items == null) {
                    throw new System.ArgumentNullException.$ctor1("items");
                }

                return new Bridge.React.ReactElementList(System.Linq.Enumerable.from(this._items).concat(System.Linq.Enumerable.from(items).select(function (item) {
                            return Bridge.React.PureComponent$1(TProps).op_Implicit(item);
                        })));
            },
            /**
             * The items set may contain null references but the set itself must not be null
             *
             * @instance
             * @public
             * @this Bridge.React.ReactElementList
             * @memberof Bridge.React.ReactElementList
             * @param   {Function}                                    TProps    
             * @param   {System.Collections.Generic.IEnumerable$1}    items
             * @return  {Bridge.React.ReactElementList}
             */
            add$4: function (TProps, items) {
                if (items == null) {
                    throw new System.ArgumentNullException.$ctor1("items");
                }

                return new Bridge.React.ReactElementList(System.Linq.Enumerable.from(this._items).concat(System.Linq.Enumerable.from(items).select(function (item) {
                            return Bridge.React.StatelessComponent$1(TProps).op_Implicit(item);
                        })));
            },
            getEnumerator: function () {
                return Bridge.getEnumerator(this._items, Object);
            },
            System$Collections$IEnumerable$GetEnumerator: function () {
                return this.getEnumerator();
            }
        }
    });

    Bridge.define("Bridge.React.StatelessComponent$1", function (TProps) { return {
        statics: {
            fields: {
                _reactStatelessRenderFunctions: null
            },
            ctors: {
                init: function () {
                    this._reactStatelessRenderFunctions = new (System.Collections.Generic.Dictionary$2(Function,Function))();
                }
            },
            methods: {
                op_Implicit: function (component) {
                    // Since React 0.11 (see https://facebook.github.io/react/blog/2014/07/17/react-v0.11.html), it has been acceptable to return null from a Render method to
                    // indicate that nothing should be rendered. As such, it's possible that a null StatelessComponent reference will pass through this operator method and
                    // so null needs to be allowed (previously this would throw a ArgumentNullException for a null component).
                    if (component == null) {
                        return null;
                    }
                    return component._reactElement;
                },
                op_Implicit$1: function (component) {
                    // Since React 0.11 (see https://facebook.github.io/react/blog/2014/07/17/react-v0.11.html), it has been acceptable to return null from a Render method to
                    // indicate that nothing should be rendered. As such, it's possible that a null StatelessComponent reference will pass through this operator method and
                    // so null needs to be allowed (previously this would throw a ArgumentNullException for a null component).
                    if (component == null) {
                        return null;
                    }
                    return component._reactElement;
                }
            }
        },
        fields: {
            _reactElement: null
        },
        props: {
            /**
             * Props is not used by all components and so this may be null
             *
             * @instance
             * @protected
             * @readonly
             * @memberof Bridge.React.StatelessComponent$1
             * @function unwrappedProps
             * @type TProps
             */
            unwrappedProps: {
                get: function () {
                    return Bridge.React.ComponentPropsHelpers.unWrapValueIfDefined(this.props);
                }
            },
            /**
             * This will never be null nor contain any null references, though it may be empty if there are no children to render
             *
             * @instance
             * @protected
             * @readonly
             * @memberof Bridge.React.StatelessComponent$1
             * @function children
             * @type Array.<System.Object>
             */
            children: {
                get: function () {
                    // See notes in PureComponent's Children property for details about what's going on here
                    return this.props && this.props.children ? (Array.isArray(this.props.children) ? this.props.children : [this.props.children]) : [];
                }
            }
        },
        ctors: {
            ctor: function (props, children) {
                if (children === void 0) { children = []; }

                this.$initialize();
                // When preparing the "_reactStatelessRenderFunction" reference, a local "reactStatelessRenderFunction" alias is used - this is just so that the JavaScript
                // code further down (which calls React.createElement) can use this local alias and not have to know how Bridge stores static references.
                var reactStatelessRenderFunction = { };
                var currentType = Bridge.getType(this); // Cast to object first in case derived class uses [IgnoreGeneric] - see http://forums.bridge.net/forum/bridge-net-pro/bugs/3343
                if (!Bridge.React.StatelessComponent$1(TProps)._reactStatelessRenderFunctions.tryGetValue(currentType, reactStatelessRenderFunction)) {
                    reactStatelessRenderFunction.v = this.createStatelessRenderFunction();
                    Bridge.React.StatelessComponent$1(TProps)._reactStatelessRenderFunctions.set(currentType, reactStatelessRenderFunction.v);
                }

                // When we pass the props reference to React.createElement, React's internals will rip it apart and reform it - which will cause problems if TProps is a
                // class with property getters and setters (or any other function) defined on the prototype, since members from the class prototype are not maintained
                // in this process. Wrapping the props reference into a "value" property gets around this problem, we just have to remember to unwrap them again when
                // we render. In most cases where children are specified as a params array, we don't want the "children require unique keys" warning from React (you
                // don't get it if you call DOM.Div(null, "Item1", "Item2"), so we don't want it in most cases here either - to achieve this, we prepare an arguments
                // array and pass that to React.createElement in an "apply" call. Similar techniques are used in the stateful component.
                var createElementArgs = System.Array.init([reactStatelessRenderFunction.v, Bridge.React.ComponentPropsHelpers.wrapProps(props)], System.Object);
                if (children != null) {
                    createElementArgs = createElementArgs.concat.apply(createElementArgs, children);
                }
                this._reactElement = React.createElement.apply(null, createElementArgs);
            }
        },
        methods: {
            createStatelessRenderFunction: function () {
                // We need to prepare a function to give to React.createElement that takes a props reference and maintains that for the instance of the element for the
                // duration of the Render call AND for any work that might happen later, such as in an OnChange callback (or other event-handler). To do this, we need an
                // instance that will capture this props value and that has all of the functionality of the original component (such as any functions that it has). The
                // best way that I can think of is to use Object.create to prepare a new instance, taking the prototype of the component class, and then setting its
                // props reference, then wrapping this all in a function that calls its Render function, binding to this instance. This woud mean that the constructor
                // would not get called on the component, but that's just the same as for stateful components (from the Component class).
                			var classPrototype = this.constructor.prototype;
                			var scopeBoundFunction = function(props) {
                				var target = Object.create(classPrototype);
                				target.props = props;
                				return target.render.apply(target, []);
                			}
                			

                // We have an anonymous function for the renderer now but it would better to name it, since React Dev Tools will use show the function name (if defined) as
                // the component name in the tree. The only way to do this is, unfortunately, with eval - but the only dynamic content is the class name (which should be
                // safe to use since valid C# class names should be valid JavaScript function names, with no escaping required) and this work is only performed once per
                // class, since it is stored in a static variable - so the eval calls will be made very infrequently (so performance is not a concern).
                var className = Bridge.React.ComponentNameHelpers.getDisplayName(this);
                var namedScopeBoundFunction = null;
                			eval("namedScopeBoundFunction = function " + className + "(props) { return scopeBoundFunction(props); };");
                			
                return namedScopeBoundFunction;
            }
        }
    }; });

    /**
     * While the class-based component structure (using the PureComponent and StatelessComponent base classes) is very convenient and feels natural, there is some overhead to
     constructing the component instances. For the vast majority of the time, this will probably not cause any problems. However, if you have a page where you may need to
     update 1000s of elements at a time then this construction cost may become non-neligible. An alternative is to use static render methods instead of component classes.
     The methods in this class make that possible - the render methods used provided must take a single props argument and return a ReactElement. If the props type supports
     shallow comparison for change detection (which is highly recommended but often requires immutable types to be used for all properties) then the Pure method should be
     used; this will result in a component with a ShouldComponentUpdate implementation that will tell React not to re-render if the props data hasn't changed. If the props
     type does not support shallow comparison then the Stateless method should be used; this uses a lighter weight structure to create the React element but there is no
     way to support a ShouldComponentUpdate mechanism.
     *
     * @static
     * @abstract
     * @public
     * @class Bridge.React.StaticComponent
     */
    Bridge.define("Bridge.React.StaticComponent", {
        statics: {
            methods: {
                /**
                 * Use this if the props type supports shallow comparison (which generally requires immutable types to be used for all of the props values) - the resulting component
                 will automatically be assigned a ShouldComponentUpdate function so that re-renders of the component may be avoided if the props data has not changed.
                 *
                 * @static
                 * @public
                 * @this Bridge.React.StaticComponent
                 * @memberof Bridge.React.StaticComponent
                 * @param   {Function}       TProps      
                 * @param   {System.Func}    renderer    
                 * @param   {TProps}         props
                 * @return  {Object}
                 */
                pure: function (TProps, renderer, props) {
                    			var componentClass = renderer.$$componentClass;
                    			if (!componentClass) {
                    				var doPropsReferencesMatch = this.doPropsReferencesMatch;
                    				componentClass = React.createClass({
                    					displayName: renderer.name,
                    					render: function () {
                    						return renderer(this.props.value);
                    					},
                    					shouldComponentUpdate: function (nextProps, nextState) {
                    						return !doPropsReferencesMatch(this.props ? this.props.value : null, nextProps ? nextProps.value : null);
                    					}
                    				});
                    				renderer.$$componentClass = componentClass;
                    			}
                    			
                    var wrappedProps = Bridge.React.ComponentPropsHelpers.wrapProps(props);
                    return React.createElement(componentClass, wrappedProps);
                },
                /**
                 * Use this if the props type does not support shallow comparisons
                 *
                 * @static
                 * @public
                 * @this Bridge.React.StaticComponent
                 * @memberof Bridge.React.StaticComponent
                 * @param   {Function}       TProps      
                 * @param   {System.Func}    renderer    
                 * @param   {TProps}         props
                 * @return  {Object}
                 */
                stateless: function (TProps, renderer, props) {
                    			var namedScopeBoundFunction;
                    			eval("namedScopeBoundFunction = function " + renderer.name + "(props) { return renderer(props ? props.value : props); };");
                    			
                    var wrappedProps = Bridge.React.ComponentPropsHelpers.wrapProps(props);
                    return React.createElement(namedScopeBoundFunction, wrappedProps);
                },
                /**
                 * This method is just here to make it easier for the native JavaScript in the method above to call the static function in the ComponentPropsHelpers
                 class without us having to bake in the way that Bridge represents static functions on classes
                 *
                 * @static
                 * @this Bridge.React.StaticComponent
                 * @memberof Bridge.React.StaticComponent
                 * @param   {Function}    TProps    
                 * @param   {TProps}      props1    
                 * @param   {TProps}      props2
                 * @return  {boolean}
                 */
                doPropsReferencesMatch: function (props1, props2) {
                    return Bridge.React.ComponentPropsHelpers.doPropsReferencesMatch(props1, props2);
                }
            }
        }
    });

    Bridge.define("Bridge.React.Style", {
        statics: {
            methods: {
                mergeWith: function (source, other) {
                    var merged = { };
                    if (source) {
                        for (var i in source) {
                            merged[i] = source[i];
                        }
                    }
                    if (other) {
                        for (var i in other) {
                            merged[i] = other[i];
                        }
                    }
                    return merged;
                },
                height$1: function (height) {
                    return { height: height };
                },
                height: function (style, height) {
                    style.height = height;
                    return style;
                },
                width$1: function (width) {
                    return { width: width };
                },
                width: function (style, width) {
                    style.width = width;
                    return style;
                },
                fontSize$1: function (fontSize) {
                    return { fontSize: fontSize };
                },
                fontSize: function (style, fontSize) {
                    style.fontSize = fontSize;
                    return style;
                },
                margin$2: function (margin) {
                    return { margin: margin };
                },
                margin$3: function (top, right, bottom, left) {
                    return { marginTop: top, marginLeft: left, marginRight: right, marginBottom: bottom };
                },
                margin: function (style, margin) {
                    style.margin = margin;
                    return style;
                },
                margin$1: function (style, top, right, bottom, left) {
                    style.marginTop = top;
                    style.marginLeft = left;
                    style.marginRight = right;
                    style.marginBottom = bottom;
                    return style;
                },
                padding$2: function (padding) {
                    return { padding: padding };
                },
                padding$3: function (top, right, bottom, left) {
                    return { paddingTop: top, paddingLeft: left, paddingRight: right, paddingBottom: bottom };
                },
                padding: function (style, padding) {
                    style.padding = padding;
                    return style;
                },
                padding$1: function (style, top, right, bottom, left) {
                    style.paddingTop = top;
                    style.paddingLeft = left;
                    style.paddingRight = right;
                    style.paddingBottom = bottom;
                    return style;
                }
            }
        }
    });

    Bridge.define("Bridge.React.AppDispatcher", {
        inherits: [Bridge.React.IDispatcher],
        fields: {
            _callbacks: null,
            _executingCallbacks: null,
            _finishedCallbacks: null,
            _isDispatching: false,
            _currentMessage: null
        },
        alias: [
            "dispatch", "Bridge$React$IDispatcher$dispatch",
            "receive", "Bridge$React$IDispatcher$receive",
            "register", "Bridge$React$IDispatcher$register",
            "unregister", "Bridge$React$IDispatcher$unregister",
            "handleViewAction", "Bridge$React$IDispatcher$handleViewAction",
            "handleServerAction", "Bridge$React$IDispatcher$handleServerAction",
            "waitFor$1", "Bridge$React$IDispatcher$waitFor$1",
            "waitFor", "Bridge$React$IDispatcher$waitFor"
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
                this._callbacks = new (System.Collections.Generic.Dictionary$2(Bridge.React.DispatchToken,Function))();
                this._executingCallbacks = new (System.Collections.Generic.HashSet$1(Bridge.React.DispatchToken)).ctor();
                this._finishedCallbacks = new (System.Collections.Generic.HashSet$1(Bridge.React.DispatchToken)).ctor();
                this._isDispatching = false;
                this._currentMessage = null;
            }
        },
        methods: {
            /**
             * Dispatches an action that will be sent to all callbacks registered with this dispatcher.
             *
             * @instance
             * @public
             * @this Bridge.React.AppDispatcher
             * @memberof Bridge.React.AppDispatcher
             * @param   {Bridge.React.IDispatcherAction}    action    The action to dispatch; may not be null.
             * @return  {void}
             */
            dispatch: function (action) {
                if (action == null) {
                    throw new System.ArgumentNullException.$ctor1("action");
                }

                // The obsolete MessageSourceOptions handling needs to stay in the meantime, so just dispatch this as any arbitrary source.
                // Eventually this method should absorb the Dispatch(DispatcherMessage message) method's behaviour but dispatch the action
                // directly down to the event handler without wrapping it in a DispatcherMessage. /// Type or member is obsolete


                this.dispatch$1(new Bridge.React.DispatcherMessage(Bridge.React.MessageSourceOptions.view, action));
            },
            dispatch$1: function (message) {
                var $t;
                if (message == null) {
                    throw new System.ArgumentNullException.$ctor1("message");
                }

                if (this._isDispatching) {
                    throw new System.InvalidOperationException.$ctor1("Cannot dispatch while already dispatching");
                }

                this._isDispatching = true;
                this._currentMessage = message;
                this._executingCallbacks.clear();
                this._finishedCallbacks.clear();
                try {
                    $t = Bridge.getEnumerator(this._callbacks);
                    try {
                        while ($t.moveNext()) {
                            var callback = $t.Current;
                            // Skip over callbacks that have already been called (by an earlier callback that used WaitFor)
                            if (this._finishedCallbacks.contains(callback.key)) {
                                continue;
                            }

                            this._executingCallbacks.add(callback.key);
                            callback.value(this._currentMessage);
                            this._executingCallbacks.remove(callback.key);
                            this._finishedCallbacks.add(callback.key);
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$Dispose();
                        }
                    }}
                finally {
                    this._isDispatching = false;
                    this._currentMessage = null;
                    this._executingCallbacks.clear();
                    this._finishedCallbacks.clear();
                }
            },
            /**
             * Registers a callback to receive actions dispatched through this dispatcher. For historical reasons, this is called Receive instead of Register - this interface originally only had a Register method
             that accepted a callback for DispatcherMessage instance, which were actions paired with a source of either View or Server and which were dispatched via methods HandleViewAction or HandleServerAction.
             These methods and the DispatcherMessage class are now considered obsolete, as is the Register method that receives DispatcherMessage instance. However, in order to avoid breaking existing code, the
             method that registers to receive unwrapped IDispatcherAction instances must be called a name other than Register (otherwise previously-compiling code could be afflicted by call-is-ambiguous errors).
             *
             * @instance
             * @public
             * @this Bridge.React.AppDispatcher
             * @memberof Bridge.React.AppDispatcher
             * @param   {System.Action}                 callback    The callback; may not be null.
             * @return  {Bridge.React.DispatchToken}
             */
            receive: function (callback) {
                if (Bridge.staticEquals(callback, null)) {
                    throw new System.ArgumentNullException.$ctor1("callback");
                }

                // We have to keep support for the DispatcherMessage class for now (until a breaking release is made), so the _dispatcher
                // event handler has to take DispatcherMessages for now, and we have to wrap the callback given here. /// Type or member is obsolete


                return this.register(function (message) {
                    callback(message.action);
                });
            },
            /**
             * Actions will sent to each receiver in the same order as which the receivers called Register.
             *
             * @instance
             * @public
             * @this Bridge.React.AppDispatcher
             * @memberof Bridge.React.AppDispatcher
             * @param   {System.Action}                 callback
             * @return  {Bridge.React.DispatchToken}
             */
            register: function (callback) {
                if (Bridge.staticEquals(callback, null)) {
                    throw new System.ArgumentNullException.$ctor1("callback");
                }

                if (this._isDispatching) {
                    throw new System.InvalidOperationException.$ctor1("Cannot register a dispatch token while dispatching");
                }

                var token = new Bridge.React.DispatchToken();
                this._callbacks.add(token, callback);
                return token;
            },
            /**
             * Unregisters the callback associated with the given token.
             *
             * @instance
             * @public
             * @this Bridge.React.AppDispatcher
             * @memberof Bridge.React.AppDispatcher
             * @param   {Bridge.React.DispatchToken}    token    The dispatch token to unregister; may not be null.
             * @return  {void}
             */
            unregister: function (token) {
                if (token == null) {
                    throw new System.ArgumentNullException.$ctor1("token");
                }
                if (!this._callbacks.containsKey(token)) {
                    throw new System.ArgumentException.$ctor3("", "token");
                }

                if (this._isDispatching) {
                    throw new System.InvalidOperationException.$ctor1("Cannot unregister a dispatch token while dispatching");
                }

                if (!this._callbacks.containsKey(token)) {
                    throw new System.InvalidOperationException.$ctor1(System.String.format("Invalid {0} specified - not currently registered", ["token"]));
                }

                this._callbacks.remove(token);
            },
            handleViewAction: function (action) {
                if (action == null) {
                    throw new System.ArgumentNullException.$ctor1("action");
                }

                this.dispatch$1(new Bridge.React.DispatcherMessage(Bridge.React.MessageSourceOptions.view, action));
            },
            handleServerAction: function (action) {
                if (action == null) {
                    throw new System.ArgumentNullException.$ctor1("action");
                }

                this.dispatch$1(new Bridge.React.DispatcherMessage(Bridge.React.MessageSourceOptions.server, action));
            },
            /**
             * Waits for the callbacks associated with the given tokens to be called first during a dispatch operation.
             *
             * @instance
             * @public
             * @this Bridge.React.AppDispatcher
             * @memberof Bridge.React.AppDispatcher
             * @param   {System.Collections.Generic.IEnumerable$1}    tokens    The tokens to wait on; may not be null.
             * @return  {void}
             */
            waitFor$1: function (tokens) {
                var $t;
                if (tokens == null) {
                    throw new System.ArgumentNullException.$ctor1("tokens");
                }
                tokens = System.Linq.Enumerable.from(tokens).ToArray(); // Evaluate the set now, just to be 100% sure that its contents while mutate while we're validating and processing it
                if (!System.Linq.Enumerable.from(tokens).any()) {
                    throw new System.ArgumentException.$ctor1(System.String.format("Empty {0} set - invalid (must wait for at least one DispatchToken)", ["tokens"]));
                }
                if (System.Linq.Enumerable.from(tokens).any($asm.$.Bridge.React.AppDispatcher.f1)) {
                    throw new System.ArgumentException.$ctor1(System.String.format("Null reference encountered in {0} set", ["tokens"]));
                }
                if (!System.Linq.Enumerable.from(tokens).all(Bridge.fn.bind(this, $asm.$.Bridge.React.AppDispatcher.f2))) {
                    throw new System.ArgumentException.$ctor3("All given tokens must be registered with this dispatcher", "tokens");
                }

                if (!this._isDispatching) {
                    throw new System.InvalidOperationException.$ctor1("Can only call WaitFor while dispatching");
                }

                // Ensure there isn't a circular dependency of tokens waiting on each other
                if (System.Linq.Enumerable.from(tokens).any(Bridge.fn.bind(this, $asm.$.Bridge.React.AppDispatcher.f3))) {
                    throw new System.ArgumentException.$ctor3("None of the tokens can have its callback already executing", "tokens");
                }

                $t = Bridge.getEnumerator(tokens, Bridge.React.DispatchToken);
                try {
                    while ($t.moveNext()) {
                        var token = $t.Current;
                        // Skip over callbacks that have already been called
                        if (this._finishedCallbacks.contains(token)) {
                            continue;
                        }

                        this._executingCallbacks.add(token);
                        this._callbacks.get(token)(this._currentMessage);
                        this._executingCallbacks.remove(token);
                        this._finishedCallbacks.add(token);
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$Dispose();
                    }
                }},
            /**
             * Waits for the callbacks associated with the given tokens to be called first during a dispatch operation.
             *
             * @instance
             * @public
             * @this Bridge.React.AppDispatcher
             * @memberof Bridge.React.AppDispatcher
             * @param   {Array.<Bridge.React.DispatchToken>}    tokens    The tokens to wait on; may not be null.
             * @return  {void}
             */
            waitFor: function (tokens) {
                if (tokens === void 0) { tokens = []; }
                this.waitFor$1(Bridge.cast(tokens, System.Collections.Generic.IEnumerable$1(Bridge.React.DispatchToken)));
            }
        }
    });

    Bridge.ns("Bridge.React.AppDispatcher", $asm.$);

    Bridge.apply($asm.$.Bridge.React.AppDispatcher, {
        f1: function (token) {
            return token == null;
        },
        f2: function (token) {
            return this._callbacks.containsKey(token);
        },
        f3: function (token) {
            return this._executingCallbacks.contains(token);
        }
    });

    Bridge.define("Bridge.React.DispatcherMessageExtensions.DispatcherMessageMatcher", {
        inherits: [Bridge.React.DispatcherMessageExtensions.IMatchDispatcherMessages],
        $kind: "nested class",
        fields: {
            _message: null
        },
        alias: [
            "else", "Bridge$React$DispatcherMessageExtensions$IMatchDispatcherMessages$else",
            "else$1", "Bridge$React$DispatcherMessageExtensions$IMatchDispatcherMessages$else$1",
            "ifAnyMatched", "Bridge$React$DispatcherMessageExtensions$IMatchDispatcherMessages$ifAnyMatched"
        ],
        ctors: {
            ctor: function (message) {
                this.$initialize();
                if (message == null) {
                    throw new System.ArgumentNullException.$ctor1("message");
                }
                this._message = message;
            }
        },
        methods: {
            else: function (T, work) {
                return this.elseWithOptionalCondition(T, null, work);
            },
            else$1: function (T, condition, work) {
                if (Bridge.staticEquals(condition, null)) {
                    throw new System.ArgumentNullException.$ctor1("condition");
                }

                return this.elseWithOptionalCondition(T, condition, work);
            },
            elseWithOptionalCondition: function (T, optionalCondition, work) {
                if (Bridge.staticEquals(work, null)) {
                    throw new System.ArgumentNullException.$ctor1("work");
                }

                var actionOfDesiredType = Bridge.as(this._message.action, T);
                if ((actionOfDesiredType == null) || ((!Bridge.staticEquals(optionalCondition, null)) && !optionalCondition(actionOfDesiredType))) {
                    return this;
                }

                work(actionOfDesiredType);
                return Bridge.React.DispatcherMessageExtensions.MatchFoundSoMatchNoMoreDispatcherMessageMatcher.instance;
            },
            ifAnyMatched: function (work) {
                if (Bridge.staticEquals(work, null)) {
                    throw new System.ArgumentNullException.$ctor1("work");
                }

                // Do nothing here - there has been no DispatcherMessage action successfully matched by this point (if there had been then
                // we would have returned a MatchFoundSoMatchNoMoreDispatcherMessageMatcher)
            }
        }
    });

    Bridge.define("Bridge.React.DispatcherMessageExtensions.MatchFoundSoMatchNoMoreDispatcherMessageMatcher", {
        inherits: [Bridge.React.DispatcherMessageExtensions.IMatchDispatcherMessages],
        $kind: "nested class",
        statics: {
            fields: {
                instance: null
            },
            ctors: {
                init: function () {
                    this.instance = new Bridge.React.DispatcherMessageExtensions.MatchFoundSoMatchNoMoreDispatcherMessageMatcher();
                }
            }
        },
        alias: [
            "else", "Bridge$React$DispatcherMessageExtensions$IMatchDispatcherMessages$else",
            "else$1", "Bridge$React$DispatcherMessageExtensions$IMatchDispatcherMessages$else$1",
            "ifAnyMatched", "Bridge$React$DispatcherMessageExtensions$IMatchDispatcherMessages$ifAnyMatched"
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            else: function (T, work) {
                if (Bridge.staticEquals(work, null)) {
                    throw new System.ArgumentNullException.$ctor1("work");
                }
                return this;
            },
            else$1: function (T, condition, work) {
                if (Bridge.staticEquals(condition, null)) {
                    throw new System.ArgumentNullException.$ctor1("condition");
                }
                if (Bridge.staticEquals(work, null)) {
                    throw new System.ArgumentNullException.$ctor1("work");
                }
                return this;
            },
            ifAnyMatched: function (work) {
                if (Bridge.staticEquals(work, null)) {
                    throw new System.ArgumentNullException.$ctor1("work");
                }

                // This class is only used if a DispatcherMessage action has been succesfully matched, so any calls to IfMatched on this
                // class should result in the if-successful work being executed
                work();
            }
        }
    });

    Bridge.define("Bridge.React.IDispatcherActionExtensions.DispatcherActionMatcher", {
        inherits: [Bridge.React.IDispatcherActionExtensions.IMatchDispatcherActions],
        $kind: "nested class",
        fields: {
            _action: null
        },
        alias: [
            "else", "Bridge$React$IDispatcherActionExtensions$IMatchDispatcherActions$else",
            "else$2", "Bridge$React$IDispatcherActionExtensions$IMatchDispatcherActions$else$2",
            "else$1", "Bridge$React$IDispatcherActionExtensions$IMatchDispatcherActions$else$1",
            "ifAnyMatched", "Bridge$React$IDispatcherActionExtensions$IMatchDispatcherActions$ifAnyMatched"
        ],
        ctors: {
            ctor: function (action) {
                this.$initialize();
                if (action == null) {
                    throw new System.ArgumentNullException.$ctor1("action");
                }
                this._action = action;
            }
        },
        methods: {
            else: function (T, work) {
                return this.elseWithOptionalCondition(T, null, work);
            },
            else$2: function (T, condition, work) {
                if (Bridge.staticEquals(condition, null)) {
                    throw new System.ArgumentNullException.$ctor1("condition");
                }

                return this.elseWithOptionalCondition(T, condition, work);
            },
            else$1: function (T, work) {
                if (Bridge.staticEquals(work, null)) {
                    throw new System.ArgumentNullException.$ctor1("work");
                }

                var actionOfDesiredType = Bridge.as(this._action, T);
                if (actionOfDesiredType == null) {
                    return this;
                }

                if (work(actionOfDesiredType) === Bridge.React.ActionMatchOptions.ignored) {
                    return this;
                }

                return Bridge.React.IDispatcherActionExtensions.MatchFoundSoMatchNoMoreDispatcherActionMatcher.instance;
            },
            elseWithOptionalCondition: function (T, optionalCondition, work) {
                if (Bridge.staticEquals(work, null)) {
                    throw new System.ArgumentNullException.$ctor1("work");
                }

                var actionOfDesiredType = Bridge.as(this._action, T);
                if ((actionOfDesiredType == null) || ((!Bridge.staticEquals(optionalCondition, null)) && !optionalCondition(actionOfDesiredType))) {
                    return this;
                }

                work(actionOfDesiredType);
                return Bridge.React.IDispatcherActionExtensions.MatchFoundSoMatchNoMoreDispatcherActionMatcher.instance;
            },
            ifAnyMatched: function (work) {
                if (Bridge.staticEquals(work, null)) {
                    throw new System.ArgumentNullException.$ctor1("work");
                }

                // Do nothing here - there has been no IDispatcherAction successfully matched by this point (if there had been then
                // we would have returned a MatchFoundSoMatchNoMoreDispatcherActionMatcher)
            }
        }
    });

    Bridge.define("Bridge.React.IDispatcherActionExtensions.MatchFoundSoMatchNoMoreDispatcherActionMatcher", {
        inherits: [Bridge.React.IDispatcherActionExtensions.IMatchDispatcherActions],
        $kind: "nested class",
        statics: {
            fields: {
                instance: null
            },
            ctors: {
                init: function () {
                    this.instance = new Bridge.React.IDispatcherActionExtensions.MatchFoundSoMatchNoMoreDispatcherActionMatcher();
                }
            }
        },
        alias: [
            "else", "Bridge$React$IDispatcherActionExtensions$IMatchDispatcherActions$else",
            "else$2", "Bridge$React$IDispatcherActionExtensions$IMatchDispatcherActions$else$2",
            "else$1", "Bridge$React$IDispatcherActionExtensions$IMatchDispatcherActions$else$1",
            "ifAnyMatched", "Bridge$React$IDispatcherActionExtensions$IMatchDispatcherActions$ifAnyMatched"
        ],
        ctors: {
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            else: function (T, work) {
                if (Bridge.staticEquals(work, null)) {
                    throw new System.ArgumentNullException.$ctor1("work");
                }
                return this;
            },
            else$2: function (T, condition, work) {
                if (Bridge.staticEquals(condition, null)) {
                    throw new System.ArgumentNullException.$ctor1("condition");
                }
                if (Bridge.staticEquals(work, null)) {
                    throw new System.ArgumentNullException.$ctor1("work");
                }
                return this;
            },
            else$1: function (T, work) {
                if (Bridge.staticEquals(work, null)) {
                    throw new System.ArgumentNullException.$ctor1("work");
                }
                return this;
            },
            ifAnyMatched: function (work) {
                if (Bridge.staticEquals(work, null)) {
                    throw new System.ArgumentNullException.$ctor1("work");
                }

                // This class is only used if an IDispatcherAction has been succesfully matched, so any calls to IfMatched on this
                // class should result in the if-successful work being executed
                work();
            }
        }
    });
});
