$(document).ready(function() {
  $('#send-btn').on('click', function() {
      const userMessage = $('#user-input').val();
      if (userMessage) {
          $('#chat-box').append(`<div><strong>You:</strong> ${userMessage}</div>`);
          $('#user-input').val('');

          $.ajax({
              url: '/chat',
              method: 'POST',
              contentType: 'application/json',
              data: JSON.stringify({ message: userMessage }),
              success: function(response) {
                  $('#chat-box').append(`<div><strong>Bot:</strong> ${response.message.replace(/\n/g, '<br>')}</div>`);
                  $('#chat-box').scrollTop($('#chat-box')[0].scrollHeight);
              }
          });
      }
  });

  $('#user-input').on('keypress', function(e) {
      if (e.which === 13) {
          $('#send-btn').click();
      }
  });
});
