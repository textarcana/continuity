var conf, job, player, metadataForBuild, humanizedDuration, humanizedTimestamp;

conf = {
    'url' : '/fixtures/bamboo.json',
    'isBuilding' : function(data) {
        /* unclear how to get currently-building status from Bamboo */
        return false;
    },
    'isSuccess' : function(data) {
        return data.state === 'Successful';
    }
};

job = {
    'name' : 'The Build'
};

player = 'Homer J. Simpson';

humanizedDuration = '5 minutes';

metadataForBuild = '<span class="metadata">as of ';
metadataForBuild += humanizedDuration;
metadataForBuild += ' ago';
metadataForBuild += '</span>';

jQuery(function() {

    var message, colorForMessage;

    function isTrunkGreen() {
        var responseOK, subtext;

        responseOK = false;
        message = 'tubes R clogged';
        subtext = '';

        jQuery.getJSON(conf.url, function(data) {

                if (conf.isBuilding(data) === true) {
                    message = player;
                    subtext = 'building ' + job.name + metadataForBuild;
                    colorForMessage = 'black';

                } else if (conf.isSuccess(data) === false) {
                    message = player;
                    subtext = 'fixing ' + job.name + metadataForBuild;
                    colorForMessage = 'red';

                } else {
                    message = player;
                    subtext = job.name + ' succeeded!' + metadataForBuild;
                    colorForMessage = 'green';
                }

            jQuery('#yesno').attr('class', colorForMessage).html(
                    '<a href="' + data.url +
                    '" title="status of the ' + data.name +
                    ' view in CI" target="_blank">' +
                    '<div>' + message + '<p class="small">' +
                    subtext + '</p>' + '</div></a>');

            responseOK = true;
        });

        window.setTimeout(function() {
            if (! responseOK) {
                jQuery('#yesno').attr('class', colorForMessage).html('<div style="font-style: italic">' + message + '</div>');
            }
        }, 120 * 1000);
    }

    window.setInterval(isTrunkGreen, 30 * 1000);

    isTrunkGreen();
});
