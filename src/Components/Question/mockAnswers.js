export const mockAnswers = [
  {
    id: 1,
    questionId: 1,
    votes: 3,
    isAccepted: false,
    author: "Jacques Gaudin",
    avatar: "JG",
    timeAgo: "Dec 19, 2017 at 14:00",
    body: `It is hard to tell you how to fix the error as you do not provide the code that triggers it, but in substance it comes from the fact that GHPython is IronPython (an implementation of Python based on .Net) whereas Python Shell is an implementation written in C.

The two implementations are similar but you sometimes hit a difference.

In your case the script is expecting a **string** or **tuple** but gets an \`IronPython.Runtime.Bytes\`.`,
  },
  {
    id: 2,
    questionId: 1,
    votes: 1,
    isAccepted: true,
    author: "Serge Ballesta",
    avatar: "SB",
    timeAgo: "Dec 19, 2017 at 18:55",
    body: `Hmm, got bytes when expecting \`str\` looks like a unicode string vs byte string problem.

If in Python 2 you can force a litteral string to be unicode by prepending it with \`u\`: \`u"foo"\` is a unicode string.

You can also **decode** a byte string to its unicode version:
\`b'ae\\xe9\\xe8'.decode('Latin1')\` is the unicode string \`u'aeéè'\`.`,
  },
];
