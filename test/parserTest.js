'use strict()';

var chai = require('chai');
var assert = chai.assert;
var MPStyle = require('../src/mp-style');

describe('Text', () => {
    it('unformatted text', () => assert.equal(MPStyle('unformatted text'), 'unformatted text'));    
    it('formatting only', () => assert.equal(MPStyle('$o$fff'), ''));
    it('escape $', () => assert.equal(MPStyle('USD $$'), 'USD $'));
});

describe('Formatting', () => {
    it('bold text, closed', () => assert.equal(MPStyle('some $obold$o text'), 'some <span style="font-weight:bold;">bold</span> text'));
    it('italic text, open end', () => assert.equal(MPStyle('some $iitalic text'), 'some <span style="font-style:italic;">italic text</span>'));
    it('narrow text', () => assert.equal(MPStyle('some $nnarrow$n text'), 'some <span style="letter-spacing:-.1em;font-size:95%;">narrow text</span>'));
    it('wide text', () => assert.equal(MPStyle('some $wwide$w text'), 'some <span style="letter-spacing:.1em;font-size:105%;">wide text</span>'));
    it('capital text', () => assert.equal(MPStyle('$tall caps'), '<span style="text-transform:uppercase;">all caps</span>'));
    it('shadow', () => assert.equal(MPStyle('$swith shadow$s normal'), '<span style="text-shadow:1px 1px 1px rgba(0, 0, 0, 0.5);">with shadow</span> normal'));
    it('reset with $z', () => assert.equal(MPStyle('some $iitalic$z text'), 'some <span style="font-style:italic;">italic</span> text'));
    it('formatting stacks', () => assert.equal(MPStyle('base $<$f00$iother style$> back again'), 'base <span style="font-style:italic;color:#f00;">other style</span> back again'));
    it('formatting stacks (modified base style)', () => assert.equal(MPStyle('$o$f00base $<$z$iother style$> back again'), '<span style="font-weight:bold;color:#f00;">base </span><span style="font-weight:bold;font-style:italic;color:#f00;">other style</span><span style="font-weight:bold;color:#f00;"> back again</span>'));
    it('formatting stacks (reset color)', () => assert.equal(MPStyle('$o$f00base $<$i$0f0green$g baseColor$> back again'), '<span style="font-weight:bold;color:#f00;">base </span><span style="font-weight:bold;font-style:italic;color:#0f0;">green</span><span style="font-weight:bold;font-style:italic;color:#f00;"> baseColor</span><span style="font-weight:bold;color:#f00;"> back again</span>'));
});

describe('Colors', () => {
    it('valid colors', () => assert.equal(MPStyle('some $f00red text'), 'some <span style="color:#f00;">red text</span>'));
    it('reset with $z', () => assert.equal(MPStyle('$osome $f00red$z text'), '<span style="font-weight:bold;">some </span><span style="font-weight:bold;color:#f00;">red</span> text'));
    it('reset with $g', () => assert.equal(MPStyle('$osome $f00red$g text'), '<span style="font-weight:bold;">some </span><span style="font-weight:bold;color:#f00;">red</span><span style="font-weight:bold;"> text</span>'));
});

describe('Strip Tags', () => {
    it('remove bold and italic', () => assert.equal(MPStyle('some $obold$o and $00fblue $iitalic text', {stripTags: ['o', 'i']}), 'some bold and <span style="color:#00f;">blue italic text</span>'));    
    it('remove colors', () => assert.equal(MPStyle('some $obold$o and $00fblue $iitalic text', {stripTags: ['color']}), 'some <span style="font-weight:bold;">bold</span> and blue <span style="font-style:italic;">italic text</span>'));
    it('strip links', () => assert.equal(MPStyle('$l[maniaplanet.com]ManiaPlanet$l following text', {stripTags: ['l']}), 'ManiaPlanet following text'));
    it('remove all formatting', () => assert.equal(MPStyle('$obold, $nnarrow$n and $wwide$z text, $iitalic text as well $s$tBigShadow', {stripTags: 'oistwn'.split('')}), 'bold, narrow and wide text, italic text as well BigShadow'));
});

describe('Links', () => {
    it('basic link', () => assert.equal(MPStyle('$lmaniaplanet.com'), '<a href="maniaplanet.com">maniaplanet.com</a>'));
    it('alternative title', () => assert.equal(MPStyle('$l[maniaplanet.com]ManiaPlanet'), '<a href="maniaplanet.com">ManiaPlanet</a>'));
    it('link with protocol', () => assert.equal(MPStyle('$l[https://maniaplanet.com]ManiaPlanet'), '<a href="https://maniaplanet.com">ManiaPlanet</a>'));
    it('properly ended', () => assert.equal(MPStyle('$l[maniaplanet.com]ManiaPlanet$l following text'), '<a href="maniaplanet.com">ManiaPlanet</a> following text'));
    it('empty title', () => assert.equal(MPStyle('$l[maniaplanet.com]$o$l'), ''));
    it('add manialink protocol', () => assert.equal(MPStyle('$h[maniaflash]ManiaFlash$h'), '<a href="maniaplanet://maniaflash">ManiaFlash</a>'));
    it('manialink protocol included', () => assert.equal(MPStyle('$h[maniaplanet://maniaflash]ManiaFlash$h'), '<a href="maniaplanet://maniaflash">ManiaFlash</a>'));
    it('add alternative manialink protocol', () => assert.equal(MPStyle('$h[maniaflash]ManiaFlash$h', {mlProtocol: 'tmtp://'}), '<a href="tmtp://maniaflash">ManiaFlash</a>'));
});

describe('Using Classes', () => {
    it('add classes instead of inline styles', () => assert.equal(MPStyle('$oBold$o text', {useClasses: true}), '<span class="mp-bold">Bold</span> text'));
    it('keep style for colors', () => assert.equal(MPStyle('$f00$oBold$o text', {useClasses: true}), '<span style="color:#f00;" class="mp-bold mp-color">Bold</span><span style="color:#f00;" class="mp-color"> text</span>'));
    it('links', () => assert.equal(MPStyle('$l[maniaplanet.com]ManiaPlanet', {useClasses: true}), '<a href="maniaplanet.com" class="mp-link mp-link-l">ManiaPlanet</a>'));
});
