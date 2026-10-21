window.__ModuleLoader__.load({
  id: '@local/live-narrator',
  factory(require) {
    const React = require('react');
    const h = React.createElement;
    const { useCallback, useEffect, useRef, useState } = React;

    const NS = 'live-narrator';
    const ENABLED_KEY = 'dsh.live-narrator.enabled';
    const VOICE_KEY = 'dsh.live-narrator.voice';

    const CSS = `
.dshln-root{width:100%;display:flex;justify-content:center;padding:2px 8px 6px;font-family:inherit;box-sizing:border-box}
.dshln-bar{display:flex;align-items:center;gap:10px;width:100%;max-width:748px;box-sizing:border-box;padding:7px 10px;border:0.5px solid var(--dsw-alias-border-l1);border-radius:14px;background:var(--dsw-alias-bg-layer-1);transition:border-color .18s ease,background .18s ease}
.dshln-bar.is-on{border-color:var(--dsw-alias-brand-primary)}
.dshln-avatar{position:relative;flex:none;width:34px;height:34px;border-radius:12px;background:linear-gradient(135deg,#7c5cff 0%,#3aa0ff 55%,#2fd4c4 100%);box-shadow:inset 0 0 0 1px rgba(255,255,255,.28);overflow:hidden}
.dshln-eye{position:absolute;top:10px;width:4px;height:7px;border-radius:2px;background:#fff;opacity:.95;animation:dshln-blink 5.6s infinite}
.dshln-eye.l{left:10px}
.dshln-eye.r{right:10px;animation-delay:.18s}
.dshln-mouth{position:absolute;left:50%;bottom:7px;width:9px;height:3px;margin-left:-4.5px;border-radius:2px;background:rgba(255,255,255,.92);transition:height .15s ease}
.dshln-bar.is-speaking .dshln-mouth{height:6px;animation:dshln-talk .34s infinite alternate ease-in-out}
.dshln-bar.is-on .dshln-avatar{box-shadow:inset 0 0 0 1px rgba(255,255,255,.28),0 0 0 3px color-mix(in srgb,var(--dsw-alias-brand-primary) 18%,transparent)}
.dshln-copy{min-width:0;flex:1;display:flex;flex-direction:column;gap:1px}
.dshln-label{display:flex;align-items:center;gap:6px;font-size:11px;line-height:14px;color:var(--dsw-alias-label-secondary);letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dshln-line{font-size:12.5px;line-height:17px;color:var(--dsw-alias-label-primary);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dshln-eq{display:inline-flex;align-items:flex-end;gap:2px;height:9px;flex:none}
.dshln-eq i{display:block;width:2px;height:4px;border-radius:1px;background:var(--dsw-alias-brand-primary);animation:dshln-eq .8s infinite ease-in-out}
.dshln-eq i:nth-child(2){animation-delay:.16s}
.dshln-eq i:nth-child(3){animation-delay:.32s}
.dshln-select{flex:none;max-width:112px;height:26px;box-sizing:border-box;border:0.5px solid var(--dsw-alias-border-l1);border-radius:8px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:11px;font-family:inherit;padding:0 4px;outline:none;cursor:pointer}
.dshln-btn{flex:none;height:26px;padding:0 10px;border:0.5px solid var(--dsw-alias-border-l2);border-radius:8px;background:transparent;color:var(--dsw-alias-label-primary);font-size:12px;line-height:24px;font-family:inherit;cursor:pointer;transition:background .15s ease}
.dshln-btn:hover{background:var(--dsw-alias-bg-layer-2)}
.dshln-btn:focus-visible{outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}
.dshln-btn.is-off{color:var(--dsw-alias-label-secondary)}
@keyframes dshln-talk{from{transform:scaleY(.45)}to{transform:scaleY(1.25)}}
@keyframes dshln-blink{0%,92%,100%{transform:scaleY(1)}94%,96%{transform:scaleY(.12)}}
@keyframes dshln-eq{0%,100%{height:3px}50%{height:9px}}
@media (max-width:640px){.dshln-select{display:none}.dshln-label{font-size:10px}}
`;

    const DICT = {
      en: {
        'ui.name': 'Little Mouth · live narration',
        'ui.start': 'Unmute',
        'ui.stop': 'Mute',
        'ui.idle': 'Standing by — I start talking as soon as the agent moves.',
        'ui.voice': 'Voice',
        'ui.autoVoice': 'System voice',
        'ui.greeting': 'Mic on. I will narrate as it happens.',
        'ui.sample': 'How does this voice sound?',
        'ui.unsupported': 'This browser has no speech synthesis.',
        'say.start': 'Here we go, let me take a look.',
        'say.done': 'Done. ',
        'say.error': 'Oops, something went wrong.',
        'say.thinking': 'Hmm, let me think.',
        'tool.read': 'Let me read',
        'tool.write': 'Let me write',
        'tool.edit': 'Let me edit',
        'tool.find': 'Let me find',
        'tool.search': 'Let me search for',
        'tool.command': 'Running a command',
        'tool.web': 'Let me look up',
        'tool.fetch': 'Opening a page',
        'tool.image': 'Let me look at an image',
        'tool.plan': 'Let me make a plan',
        'tool.ask': 'I have a question for you',
        'tool.agent': 'Sending a little helper',
        'tool.workflow': 'Starting a workflow',
        'tool.job': 'Checking the background job',
        'tool.schedule': 'Setting a reminder',
        'tool.skill': 'Checking the skill book',
        'tool.goal': 'Updating the goal',
        'tool.present': 'Here is the deliverable',
        'tool.plugin': 'Tinkering with a plugin',
        'tool.generic': 'Working on it',
      },
      zh: {
        'ui.name': '小嘴 · 实时解说',
        'ui.start': '开麦',
        'ui.stop': '静音',
        'ui.idle': '我在呢，AI 一动手我就开麦。',
        'ui.voice': '声音',
        'ui.autoVoice': '系统默认',
        'ui.greeting': '开麦了啊，我边看边讲。',
        'ui.sample': '这个声音怎么样？',
        'ui.unsupported': '这个浏览器没有语音合成。',
        'say.start': '来活了，我看看。',
        'say.done': '搞定，',
        'say.error': '哎呀，出岔子了。',
        'say.thinking': '嗯……让我琢磨琢磨。',
        'tool.read': '我读一下',
        'tool.write': '我写一下',
        'tool.edit': '我改一下',
        'tool.find': '我找找',
        'tool.search': '我搜一下',
        'tool.command': '我跑条命令',
        'tool.web': '我上网查查',
        'tool.fetch': '我打开个网页看看',
        'tool.image': '我看张图',
        'tool.plan': '我列个计划',
        'tool.ask': '我有个事想问你',
        'tool.agent': '我派个小助手',
        'tool.workflow': '我开个流水线',
        'tool.job': '我看看后台任务',
        'tool.schedule': '我定个提醒',
        'tool.skill': '我翻翻技能书',
        'tool.goal': '我处理一下目标',
        'tool.present': '给你看个成品',
        'tool.plugin': '我鼓捣一下插件',
        'tool.generic': '我动一下手',
      },
    };

    const TOOL_KEYS = {
      read: 'tool.read',
      read_image: 'tool.image',
      write: 'tool.write',
      edit: 'tool.edit',
      glob: 'tool.find',
      grep: 'tool.search',
      pwsh: 'tool.command',
      bash: 'tool.command',
      web_search: 'tool.web',
      web_fetch: 'tool.fetch',
      todo_write: 'tool.plan',
      ask_user_question: 'tool.ask',
      subagent: 'tool.agent',
      subagent_fork: 'tool.agent',
      workflow: 'tool.workflow',
      job_list: 'tool.job',
      job_output: 'tool.job',
      job_kill: 'tool.job',
      schedule_create: 'tool.schedule',
      schedule_update: 'tool.schedule',
      schedule_list: 'tool.schedule',
      schedule_delete: 'tool.schedule',
      skill: 'tool.skill',
      create_goal: 'tool.goal',
      update_goal: 'tool.goal',
      get_goal: 'tool.goal',
      present: 'tool.present',
      cordis_inspect_list: 'tool.plugin',
      cordis_inspect_query: 'tool.plugin',
      cordis_define: 'tool.plugin',
      cordis_run: 'tool.plugin',
      cordis_stop: 'tool.plugin',
      cordis_undefine: 'tool.plugin',
    };

    const clamp = (value, max) => {
      const text = String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
      return text.length > max ? text.slice(0, max).trim() + '…' : text;
    };

    const baseName = (value) => {
      const text = String(value == null ? '' : value).trim();
      if (!text) return '';
      const parts = text.split(/[\\/]+/).filter(Boolean);
      const name = parts.length ? parts[parts.length - 1] : text;
      return name === '.' || name === '..' ? '' : name;
    };

    const hostOf = (value) => {
      try {
        return new URL(String(value)).host.replace(/^www\./, '');
      } catch {
        return '';
      }
    };

    const readArgs = (args) => {
      if (!args || typeof args !== 'object') return null;
      if (args.object && typeof args.object === 'object') return args.object;
      if (Array.isArray(args.chunks)) {
        const joined = args.chunks.join('');
        if (!joined) return null;
        try {
          const parsed = JSON.parse(joined);
          return parsed && typeof parsed === 'object' ? parsed : null;
        } catch {
          return null;
        }
      }
      return null;
    };

    const firstString = (args, keys) => {
      if (!args) return '';
      for (const key of keys) {
        const value = args[key];
        if (typeof value === 'string' && value.trim()) return value.trim();
        if (Array.isArray(value) && typeof value[0] === 'string' && value[0].trim()) return value[0].trim();
      }
      return '';
    };

    const cleanSpeech = (text) => {
      return String(text == null ? '' : text)
        .replace(/```[\s\S]*?```/g, ' ')
        .replace(/`([^`]*)`/g, '$1')
        .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/https?:\/\/\S+/g, ' ')
        .replace(/^#{1,6}\s*/gm, '')
        .replace(/[*_>~|]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
    };

    const summarize = (text, max) => {
      const clean = cleanSpeech(text);
      if (!clean) return '';
      if (clean.length <= max) return clean;
      const cut = clean.slice(0, max);
      let end = -1;
      for (const mark of ['。', '！', '？', '. ', '! ', '? ']) {
        end = Math.max(end, cut.lastIndexOf(mark));
      }
      return (end >= Math.floor(max * 0.45) ? cut.slice(0, end + 1) : cut) + '……';
    };

    function createSpeaker() {
      const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
      const state = {
        enabled: true,
        voiceURI: '',
        active: null,
        pending: null,
        onEvent: null,
        lastText: '',
        serial: 0,
      };

      const emit = (speaking, text) => {
        if (typeof state.onEvent === 'function') state.onEvent({ speaking, text });
      };

      const hasCjk = (text) => /[\u3400-\u9fff]/.test(text);

      const pickVoice = (lang) => {
        if (!synth) return null;
        let list = [];
        try {
          list = Array.from(synth.getVoices() || []);
        } catch {
          list = [];
        }
        if (state.voiceURI) {
          const chosen = list.find((voice) => voice.voiceURI === state.voiceURI);
          if (chosen) return chosen;
        }
        const matching = list.filter((voice) => String(voice.lang || '').toLowerCase().indexOf(lang) === 0);
        if (!matching.length) return null;
        const preferred = matching.find((voice) =>
          /xiaoxiao|xiaoyi|yunxi|huihui|yaoyao|kangkang|natural|online|google/i.test(String(voice.name || '')),
        );
        return preferred || matching[0];
      };

      const pump = () => {
        if (!state.enabled) return;
        const next = state.pending;
        state.pending = null;
        if (next) play(next);
      };

      const play = (item) => {
        if (!synth) return;
        state.serial += 1;
        const token = state.serial;
        const utterance = new SpeechSynthesisUtterance(item.text);
        const voice = pickVoice(item.lang);
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        } else {
          utterance.lang = item.lang === 'zh' ? 'zh-CN' : 'en-US';
        }
        utterance.rate = item.lang === 'zh' ? 1.08 : 1.03;
        utterance.pitch = 1.04;
        utterance.volume = 1;
        state.active = { utterance, token };
        utterance.onstart = () => {
          if (!state.active || state.active.token !== token) return;
          state.lastText = item.text;
          emit(true, item.text);
        };
        const finish = () => {
          if (!state.active || state.active.token !== token) return;
          state.active = null;
          emit(false);
          pump();
        };
        utterance.onend = finish;
        utterance.onerror = finish;
        try {
          synth.speak(utterance);
        } catch {
          state.active = null;
          emit(false);
        }
      };

      const hardStop = () => {
        state.serial += 1;
        state.active = null;
        state.pending = null;
        if (synth) {
          try {
            synth.cancel();
          } catch {
            /* ignore */
          }
        }
        emit(false);
      };

      return {
        supported: Boolean(synth),
        setEnabled(value) {
          state.enabled = Boolean(value);
          if (!state.enabled) hardStop();
        },
        setVoice(uri) {
          state.voiceURI = uri || '';
        },
        voices() {
          if (!synth) return [];
          try {
            return Array.from(synth.getVoices() || []);
          } catch {
            return [];
          }
        },
        onEvent(fn) {
          state.onEvent = typeof fn === 'function' ? fn : null;
        },
        speak(text, options) {
          const value = String(text == null ? '' : text).trim();
          if (!value || !state.enabled || !synth) return;
          const opts = options || {};
          if (!opts.force && value === state.lastText && !state.active) return;
          const item = { text: value, lang: hasCjk(value) ? 'zh' : opts.lang || 'en' };
          if (opts.interrupt) {
            hardStop();
            play(item);
            return;
          }
          if (state.active) {
            state.pending = item;
            return;
          }
          play(item);
        },
        stop: hardStop,
        dispose: hardStop,
      };
    }

    return {
      inject: ['slots', 'locale'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, 'en', DICT.en));
        ctx.effect(() => ctx.locale.register(NS, 'zh', DICT.zh));
        const t = ctx.locale.bind(NS);
        const speaker = createSpeaker();

        const activeLang = () => {
          try {
            const snapshot = ctx.locale.getLocale();
            const active = snapshot && snapshot.active ? String(snapshot.active) : 'zh';
            return active.toLowerCase().indexOf('zh') === 0 ? 'zh' : 'en';
          } catch {
            return 'zh';
          }
        };

        const quote = (text) => {
          const value = clamp(text, 60);
          if (!value) return '';
          return activeLang() === 'zh' ? '「' + value + '」' : '"' + value + '"';
        };

        const toolLine = (name, args) => {
          const key = TOOL_KEYS[name] || 'tool.generic';
          const label = t(key);
          let detail = '';
          switch (name) {
            case 'read':
            case 'write':
            case 'edit':
            case 'read_image':
              detail = baseName(firstString(args, ['file_path', 'path', 'target', 'file']));
              break;
            case 'glob':
            case 'grep':
              detail = quote(firstString(args, ['pattern', 'query']));
              break;
            case 'web_search':
              detail = quote(firstString(args, ['query', 'q', 'queries']));
              break;
            case 'web_fetch':
              detail = hostOf(firstString(args, ['url']));
              break;
            case 'skill':
              detail = clamp(firstString(args, ['name', 'skill']), 30);
              break;
            case 'subagent':
            case 'subagent_fork':
            case 'workflow':
              detail = clamp(firstString(args, ['description', 'prompt', 'name']), 34);
              break;
            case 'ask_user_question':
              detail = '';
              break;
            case 'present':
              detail = '';
              break;
            case 'pwsh':
            case 'bash':
              detail = '';
              break;
            default:
              break;
          }
          if (!detail) detail = '';
          return detail ? label + ' ' + detail : label;
        };

        const toolSummary = (node) => {
          const root = node && node.data ? node.data.root : null;
          if (!root || root.kind === 'tool-result') return '';
          const name = String(root.name || '');
          if (!name) return '';
          return toolLine(name, readArgs(root.args));
        };

        const answerText = (node) => {
          const blocks = node && node.data ? node.data.blocks : null;
          if (!Array.isArray(blocks)) return '';
          return blocks
            .filter((block) => block && block.kind === 'text')
            .map((block) => block.text || '')
            .join('\n');
        };

        function Narrator(props) {
          const useChat = props.useChat;
          const useSession = props.useSession;
          const order = useChat((snapshot) => snapshot.order) || [];
          const nodes = useChat((snapshot) => snapshot.nodes);
          const running = Boolean(useSession((snapshot) => snapshot.running));
          const openState = useSession((snapshot) => snapshot.openState);

          const [enabled, setEnabled] = useState(() => {
            try {
              return localStorage.getItem(ENABLED_KEY) !== '0';
            } catch {
              return true;
            }
          });
          const [line, setLine] = useState(() => t('ui.idle'));
          const [speaking, setSpeaking] = useState(false);
          const [voiceURI, setVoiceURI] = useState(() => {
            try {
              return localStorage.getItem(VOICE_KEY) || '';
            } catch {
              return '';
            }
          });
          const [voices, setVoices] = useState([]);

          const enabledRef = useRef(enabled);
          const seenRef = useRef(null);
          const wasRunningRef = useRef(running);
          const thinkingTurnRef = useRef(null);
          const finalRef = useRef(null);

          useEffect(() => {
            speaker.onEvent((event) => {
              setSpeaking(Boolean(event.speaking));
              if (event.text) setLine(event.text);
            });
            const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
            const refresh = () => setVoices(speaker.voices());
            refresh();
            if (synth && typeof synth.addEventListener === 'function') {
              synth.addEventListener('voiceschanged', refresh);
            }
            return () => {
              speaker.onEvent(null);
              if (synth && typeof synth.removeEventListener === 'function') {
                synth.removeEventListener('voiceschanged', refresh);
              }
            };
          }, []);

          useEffect(() => {
            enabledRef.current = enabled;
            speaker.setEnabled(enabled);
            try {
              localStorage.setItem(ENABLED_KEY, enabled ? '1' : '0');
            } catch {
              /* ignore */
            }
          }, [enabled]);

          useEffect(() => {
            speaker.setVoice(voiceURI);
            try {
              localStorage.setItem(VOICE_KEY, voiceURI);
            } catch {
              /* ignore */
            }
          }, [voiceURI]);

          useEffect(() => {
            const list = Array.isArray(order) ? order : [];
            // Wait for the transcript to finish hydrating; otherwise the whole
            // history would arrive as "fresh" nodes and be narrated in a burst.
            if (openState !== 'open') {
              seenRef.current = null;
              return;
            }
            if (seenRef.current === null) {
              seenRef.current = new Set(list);
              return;
            }
            const fresh = list.filter((key) => !seenRef.current.has(key));
            if (!fresh.length) return;
            for (const key of fresh) seenRef.current.add(key);
            if (fresh.length > 4) return;
            if (!enabledRef.current || !speaker.supported) return;
            for (const key of fresh) {
              const node = nodes && typeof nodes.get === 'function' ? nodes.get(key) : undefined;
              if (!node) continue;
              if (node.kind === 'tool-call') {
                const text = toolSummary(node);
                if (text) speaker.speak(text, { lang: activeLang() });
                continue;
              }
              if (node.kind === 'turn-error') {
                speaker.speak(t('say.error'), { interrupt: true, lang: activeLang() });
                continue;
              }
              if (node.kind === 'assistant-step') {
                const turn = node.data ? node.data.turn : null;
                if (turn === thinkingTurnRef.current) continue;
                thinkingTurnRef.current = turn;
                speaker.speak(t('say.thinking'), { lang: activeLang() });
              }
            }
          }, [order, enabled, openState]);

          useEffect(() => {
            const was = wasRunningRef.current;
            wasRunningRef.current = running;
            if (was === running) return;
            if (!enabledRef.current || !speaker.supported) return;
            if (running) {
              thinkingTurnRef.current = null;
              speaker.speak(t('say.start'), { lang: activeLang() });
              return;
            }
            const list = Array.isArray(order) ? order : [];
            for (let index = list.length - 1; index >= 0; index -= 1) {
              const node = nodes && typeof nodes.get === 'function' ? nodes.get(list[index]) : undefined;
              if (!node) continue;
              if (node.kind !== 'assistant-step') continue;
              const key = node.key || list[index];
              if (finalRef.current === key) break;
              finalRef.current = key;
              const text = summarize(answerText(node), 120);
              if (text) speaker.speak(t('say.done') + text, { interrupt: true, lang: activeLang() });
              break;
            }
          }, [running]);

          useEffect(() => {
            return () => speaker.stop();
          }, []);

          const toggle = useCallback(() => {
            const next = !enabledRef.current;
            enabledRef.current = next;
            speaker.setEnabled(next);
            setEnabled(next);
            if (!next) {
              setLine(t('ui.idle'));
              setSpeaking(false);
              return;
            }
            const hello = speaker.supported ? t('ui.greeting') : t('ui.unsupported');
            setLine(hello);
            speaker.speak(hello, { interrupt: true, force: true, lang: activeLang() });
          }, []);

          const changeVoice = useCallback((event) => {
            const next = event && event.target ? event.target.value : '';
            setVoiceURI(next);
            speaker.setVoice(next);
            speaker.speak(t('ui.sample'), { interrupt: true, force: true, lang: activeLang() });
          }, []);

          const speakingClass = speaking ? ' is-speaking' : '';
          const onClass = enabled ? ' is-on' : '';
          const sortedVoices = voices.slice().sort((left, right) => {
            const leftZh = String(left.lang || '').toLowerCase().indexOf('zh') === 0 ? 0 : 1;
            const rightZh = String(right.lang || '').toLowerCase().indexOf('zh') === 0 ? 0 : 1;
            if (leftZh !== rightZh) return leftZh - rightZh;
            return String(left.name || '').localeCompare(String(right.name || ''));
          });

          return h(
            'div',
            { className: 'dshln-root' },
            h('style', null, CSS),
            h(
              'div',
              { className: 'dshln-bar' + onClass + speakingClass, role: 'group', 'aria-label': t('ui.name') },
              h(
                'div',
                { className: 'dshln-avatar', 'aria-hidden': true },
                h('span', { className: 'dshln-eye l' }),
                h('span', { className: 'dshln-eye r' }),
                h('span', { className: 'dshln-mouth' }),
              ),
              h(
                'div',
                { className: 'dshln-copy' },
                h(
                  'div',
                  { className: 'dshln-label' },
                  speaking
                    ? h('span', { className: 'dshln-eq', 'aria-hidden': true }, h('i'), h('i'), h('i'))
                    : null,
                  h('span', null, t('ui.name')),
                ),
                h('div', { className: 'dshln-line', 'aria-live': 'polite' }, line),
              ),
              enabled && sortedVoices.length
                ? h(
                    'select',
                    {
                      className: 'dshln-select',
                      value: voiceURI,
                      title: t('ui.voice'),
                      'aria-label': t('ui.voice'),
                      onChange: changeVoice,
                    },
                    h('option', { value: '' }, t('ui.autoVoice')),
                    sortedVoices.slice(0, 60).map((voice) =>
                      h(
                        'option',
                        { key: voice.voiceURI, value: voice.voiceURI },
                        (voice.name || voice.lang || 'voice') + ' · ' + (voice.lang || ''),
                      ),
                    ),
                  )
                : null,
              h(
                'button',
                {
                  type: 'button',
                  className: 'dshln-btn' + (enabled ? '' : ' is-off'),
                  onClick: toggle,
                  'aria-pressed': enabled,
                  title: enabled ? t('ui.stop') : t('ui.start'),
                },
                enabled ? t('ui.stop') : t('ui.start'),
              ),
            ),
          );
        }

        ctx.slots.inject('conversation.composer.dock', () =>
          ctx.slots.register(
            { name: 'conversation.composer.dock', id: 'live-narrator', order: 20 },
            Narrator,
          ),
        );

        ctx.effect(() => () => speaker.dispose());
      },
    };
  },
});
