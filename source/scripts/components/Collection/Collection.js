import getPage from '@/scripts/lib/router/getPage';

export default {

  /**
   * Mixins extending the component
   * @type {Array}
   */
  mixins: [],

  /**
   * Attach components
   * @type {Object}
   */
  components: { },

  /**
   * Data attached to the component
   * @return {Object}
   */
  data: () => ({

    // Holds the contents of the page
    // Coming from AJAX req
    contents: ''

  }),

  /**
   * Properties sent through to the component
   * @type {Object}
   */
  props: { },

  /**
   * Triggers when mounted
   * @return {Null}
   */
  mounted () {

    // Take over the pagination links
    // generated by statamic
    this.takeOverPagination();

  },

  /**
   * Watch for changes on props
   * @type {Object}
   */
  watch: {

    /**
     * Triggers when the route changes in the collection
     * @param {Object} route The new route
     */
    '$route' (route) {
      this.loadRoute(route.fullPath);
    }

  },

  /**
   * Methods attached to the component
   * @type {Object}
   */
  methods: {

    /**
     * Take over the pagination links generated by Statamic
     * @return  {Null}
     */
    takeOverPagination () {

      // Store the pagination links
      let pagination_links = this.$el.querySelectorAll('.pagination a');

      // Loop through the pagination links
      // And dd a click callback if we haven't already
      for (let i = 0; i < pagination_links.length; i++)
        !pagination_links[i].pagination_active
        && (pagination_links[i].pagination_active = true)
        && pagination_links[i].addEventListener(
          'click', 
          e => this.pushRoute(e, pagination_links[i])
        );

    },

    /**
     * Pushes the route from the link to vue router
     * @param {Event}       e  The event object
     * @param {HTMLElement} el The element triggering the callback
     */
    pushRoute (e, el) {

      // Stop inherit behaviour
      e.preventDefault();

      // Get the herf and the content that we need
      let path = el.getAttribute('href').match(/(?:\/[^\/]*){2}(.+)/)[1];

      // Push the path to the router
      this.$router.push(path);

    },

    /**
     * Loads the route from vue router
     * @param  {String}  path 
     * @return {Promise}
     */
    loadRoute (path) {
      
      // Get the page contents and store it
      return getPage(path).then(collection => {

        // Update the contents on the collection
        this.contents = collection.template
          .match(/<Collection[^>]*>([\s\S]*)<\/Collection>/i)[1];

        // Trigger the finish loading state on the store
        this.$store.dispatch('loading/finishLoading');

        // Run the click logic on the incoming pagination links
        this.$nextTick(() => this.takeOverPagination());

      });

    }

  },

  /**
   * Holds computed props
   * @type {Object}
   */
  computed: {

    /**
     * Gets the current page
     * @return  {Integer}
     */
    currentPage () {
      return this.$route.query.page || 1;
    },

    /**
     * Returns the collection's path
     * @return  {String}
     */
    path () {
      return this.$route.path;
    }

  }

};
