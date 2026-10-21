<template>
    <div :class="computedClasses">
        <slot />
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    wrap: {
        type: Boolean,
        default: true
    },
    direction: {
        type: String,
        default: 'row', // 'row', 'col', 'row-reverse', 'col-reverse'
        validator: (val) => ['row', 'col', 'row-reverse', 'col-reverse', ''].includes(val)
    },
    justify: {
        type: String,
        default: '', // 'start', 'end', 'center', 'between', 'around', 'evenly'
    },
    align: {
        type: String,
        default: '', // 'start', 'end', 'center', 'baseline', 'stretch'
    },
    gap: {
        type: [String, Number],
        default: ''
    }
})

// Mapeos de utilidades de Tailwind CSS
const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse'
}

const justifyClasses = {
    start: 'justify-start',
    end: 'justify-end',
    center: 'justify-center',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly'
}

const alignClasses = {
    start: 'items-start',
    end: 'items-end',
    center: 'items-center',
    baseline: 'items-baseline',
    stretch: 'items-stretch'
}

const computedClasses = computed(() => {
    const classes = ['flex']

    // Wrap
    if (props.wrap) {
        classes.push('flex-wrap')
    } else {
        classes.push('flex-nowrap')
    }

    // Direction
    if (props.direction && directionClasses[props.direction]) {
        classes.push(directionClasses[props.direction])
    }

    // Justify
    if (props.justify && justifyClasses[props.justify]) {
        classes.push(justifyClasses[props.justify])
    }

    // Align
    if (props.align && alignClasses[props.align]) {
        classes.push(alignClasses[props.align])
    }

    // Gap
    if (props.gap) {
        classes.push(`gap-${props.gap}`)
    }

    return classes.join(' ')
})
</script>