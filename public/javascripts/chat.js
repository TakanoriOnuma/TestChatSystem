var socket = io();

// ページが表示された時Chatリストを表示する
$(function() {
  getList();
});

// フォームを送信ボタンを押すと、Chatを追加して再表示する
$('#fm').submit(function() {
  postList();
  return false;
});

// Chat一覧を取得して表示する
function getList() {
  // 既に表示されている一覧を非表示にして削除する
  var $list = $('.list');
  var $chatboard = $('.chatboard');
  $list.fadeOut(function() {
    $list.children().remove();
    $chatboard.children().remove();
    // /chatにGETアクセスする
    $.get('chat', function(chats) {
      // 取得したChatを追加していく
      $.each(chats, function(index, chat) {
        $list.append(makeChat(chat));
        $chatboard.append(makeChatleaf(chat));
        $('.leaf:last').css({
          top: chat.y,
          left: chat.x
        });
        if(chat.isMove === false) {
          $('.leaf:last').hide();
        }
      });
      // 一覧を表示する
      $list.fadeIn();

      $('.list input').click(function() {
        var key = $(this).attr('key');
        socket.emit('toggleChat', {
          key : key
        });
      });

      // チャットの移動
      var flag = false;
      var pos = {};
      $('.leaf')
        .mousedown(function(e) {
          flag = true;
          return false;
        })
        .mouseup(function() {
          flag = false;
        })
        .mousemove(function(e) {
          if(flag === true) {
            $(this).css({
              top:  e.pageY - 30,
              left: e.pageX - 20
            });
            socket.emit('moveChat', {
              x : e.pageX - 20,
              y : e.pageY - 30,
              key : $(this).attr('key')
            });
          }
        });
    });
  });
}

// chatを生成する
function makeChat(chat) {
  htmlTag  = '<p>名前：' + chat.name;
  text = (chat.isMove) ? 'ON' : 'OFF';
  htmlTag += '   <input type="button" key="' + chat._id + '" value="' + text + '">';
  htmlTag += '<br>';
  htmlTag += '内容：' + chat.text;
  htmlTag += '<br>';
  return htmlTag;
}

// chatleafを生成する
function makeChatleaf(chat) {
  htmlTag = '<p class="leaf" key="' + chat._id + '">' + chat.text + '</p>';
  return htmlTag;
}

// chatというイベントを受信したらHTML要素を追加する
socket.on('chat', function(chat) {
  var $list = $('.list');
  $list.fadeIn();
  $list.append(makeChat(chat));
  $('.list input:last').click(function() {
    var key = $(this).attr('key');
    socket.emit('toggleChat', {
      key : key
    });
  });

});

// toggleChatというイベントを受信したらkeyのチャットをトグルする
socket.on('toggleChat', function(key) {
  var $button = $('.list input[key=' + key.key + ']');
  var text = $button.attr('value');
  $button.attr('value', (text === 'ON') ? 'OFF' : 'ON');

  $chat = $('.chatboard p[key=' + key.key + ']');
  if(text === 'ON') {
    $chat.hide(100);
  }
  else {
    $chat.show(100);
  }
});

// moveChatというイベントを受信したら指定したチャットを移動する
socket.on('moveChat', function(moveChat) {
  var $chat = $('.chatboard p[key=' + moveChat.key + ']');
  $chat.css({
    left: moveChat.x,
    top:  moveChat.y
  });
});

// フォーム入力されたChatを追加する
function postList() {
  // フォームに入力された値を取得
  var name = $('#name').val();
  var text = $('#text').val();

  // テキストの入力項目を空にする
  $('#text').val('');

  socket.emit('chat', {
    name : name,
    text : text
  });
}