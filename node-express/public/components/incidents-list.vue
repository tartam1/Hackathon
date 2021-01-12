Vue.component('incidents-list', {
  template: `
    <div>
      <table>
        <tr>
          <th class="col-width-ctl th-start">Incident ID</th>
          <th class="col-width-ctl">Status</th>
          <th class="col-width-ctl">Primary Affected Service</th>
          <th>Title</th>
        </tr>
        <tr @click="selectIncident" v-for="item in incidents">
          <td class="col-width-ctl">
                        {{ item.IncidentID }}
          </td>
          <td class="col-width-ctl">
                        {{ item.Status }}
          </td>
          <td class="col-width-ctl">
                        {{ item.Service }}
          </td>
          <td>
                        {{ item.Title }}
          </td>
        </tr>
      </table>
    </div>
  `,
  
  data: function() {
    return {}
  },
  
  props: [
    'incidents'
  ],

  filters: {
    localTime: function(value) {
      if (!value) return '';
      let localDateTime = new Date(value)
      let elem = localDateTime.toString().split(' ');
      localDateTime = elem[1] + ' ' + elem[2] + ' ' + elem[3] + ' ' + elem[4] + ' ' + elem[5];
      return localDateTime;
    }
  }, 
  
  methods: {
    selectIncident: function(evt) {
      const selectedIncidentId = evt.target.parentNode.querySelectorAll('td')[0].innerText;
      return this.$emit('set-selected-incident', selectedIncidentId);
    }
  }
});